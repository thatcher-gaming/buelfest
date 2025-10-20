require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.KOFI_WEBHOOK_PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.PG_URI,
    ssl: { rejectUnauthorized: false }
});

// Enable CORS for local development and production
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Ko-fi sends data as form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Test database connection on startup
async function testConnection() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('✓ Database connected:', result.rows[0].now);
    } catch (error) {
        console.error('✗ Database connection failed:', error.message);
        console.error('Make sure PG_URI is set in your .env file');
    }
}

// Ko-fi webhook endpoint
app.post('/kofi-webhook', async (req, res) => {
    try {
        console.log('Received webhook:', req.body);

        // Ko-fi sends the data as a JSON string in the 'data' field
        const data = JSON.parse(req.body.data);

        console.log('Parsed data:', data);

        // Validate that this is a donation
        if (data.type !== 'Donation' && data.type !== 'Subscription') {
            console.log('Not a donation, ignoring');
            return res.status(200).send('OK');
        }

        // Extract donation details
        const name = data.from_name || 'Anonymous';
        const amount = parseFloat(data.amount);
        const message = data.message || null;
        const email = data.email || null;
        const kofiTransactionId = data.kofi_transaction_id;
        const timestamp = data.timestamp || new Date().toISOString();

        // Store in database
        const result = await pool.query(
            `INSERT INTO donationzone.donation 
       (name, amount, cause, message, email, kofi_transaction_id, created) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (kofi_transaction_id) DO NOTHING
       RETURNING id`,
            [name, amount, 'lio', message, email, kofiTransactionId, timestamp]
        );

        if (result.rowCount === 0) {
            console.log('Donation already recorded, skipping');
        } else {
            console.log(`✓ Stored donation: ${name} donated $${amount} (ID: ${result.rows[0].id})`);
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Error processing webhook:', error);

        // Log failed webhook to database
        try {
            await pool.query(
                `CREATE TABLE IF NOT EXISTS donationzone.failed_webhooks (
          id SERIAL PRIMARY KEY,
          error TEXT,
          data JSONB,
          created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
            );

            await pool.query(
                `INSERT INTO donationzone.failed_webhooks (error, data) VALUES ($1, $2)`,
                [error.message, JSON.stringify(req.body)]
            );
        } catch (dbError) {
            console.error('Failed to log error to database:', dbError);
        }

        // Still return 200 to Ko-fi so they don't retry
        res.status(200).send('OK');
    }
});

// API endpoint to get donation totals (for your website)
app.get('/api/donations', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
        COALESCE(SUM(amount), 0) as total,
        COUNT(*) as count
       FROM donationzone.donation 
       WHERE cause = 'lio'`
        );

        const total = parseFloat(result.rows[0].total);
        const count = parseInt(result.rows[0].count);

        res.json({
            lio: {
                total: total,
                display: total.toFixed(2),
                count: count
            }
        });
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({ error: 'Failed to read donations' });
    }
});

// API endpoint to get all donations (for TouchDesigner)
app.get('/api/donations/all', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
        id, 
        name, 
        amount::text::money as amount, 
        done, 
        message, 
        created 
       FROM donationzone.donation 
       WHERE cause = 'lio'
       ORDER BY created DESC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching all donations:', error);
        res.status(500).json({ error: 'Failed to read donations' });
    }
});

// API endpoint to mark donation as done
app.patch('/api/donations/:id/done', async (req, res) => {
    try {
        const { id } = req.params;
        const { done } = req.body;

        const result = await pool.query(
            `UPDATE donationzone.donation 
       SET done = $1 
       WHERE id = $2 AND cause = 'lio'
       RETURNING id, name, done`,
            [done === true || done === 'true', id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating donation:', error);
        res.status(500).json({ error: 'Failed to update donation' });
    }
});

// API endpoint to get undone donations
app.get('/api/donations/pending', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
        id, 
        name, 
        amount::text::money as amount, 
        done, 
        message, 
        created 
       FROM donationzone.donation 
       WHERE cause = 'lio' AND done = false
       ORDER BY created DESC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching pending donations:', error);
        res.status(500).json({ error: 'Failed to read donations' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Initialize and start server
async function start() {
    await testConnection();

    app.listen(port, () => {
        console.log(`Ko-fi webhook server listening on port ${port}`);
        console.log(`Webhook URL: http://localhost:${port}/kofi-webhook`);
        console.log(`API Endpoints:`);
        console.log(`  - GET  /api/donations          - Get totals`);
        console.log(`  - GET  /api/donations/all      - Get all donations`);
        console.log(`  - GET  /api/donations/pending  - Get undone donations`);
        console.log(`  - PATCH /api/donations/:id/done - Mark as done`);
    });
}

start();

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing server...');
    await pool.end();
    process.exit(0);
});
