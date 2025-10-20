-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS donationzone;

-- Create cause enum
DO $$ BEGIN
    CREATE TYPE donationzone.cause AS ENUM ('pcrf', 'lio');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create donation table
CREATE TABLE IF NOT EXISTS donationzone.donation (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    email VARCHAR,
    amount NUMERIC NOT NULL,
    cause donationzone.cause NOT NULL,
    message VARCHAR,
    done BOOL NOT NULL DEFAULT FALSE,
    kofi_transaction_id VARCHAR UNIQUE,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_kofi_transaction_id ON donationzone.donation(kofi_transaction_id);
CREATE INDEX IF NOT EXISTS idx_cause ON donationzone.donation(cause);
CREATE INDEX IF NOT EXISTS idx_created ON donationzone.donation(created DESC);
CREATE INDEX IF NOT EXISTS idx_done ON donationzone.donation(done);
