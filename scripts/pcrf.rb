require 'dotenv/load'
require 'mail'
require 'pg'
require 'json'

$db = PG.connect ENV["PG_URI"]

Mail.defaults do
    retriever_method :imap,
                     address: ENV["IMAP_SERVER"],
                     port: 993,
                     user_name: ENV["MAIL_USERNAME"],
                     password: ENV["MAIL_PASSWORD"],
                     enable_ssl: true
    delivery_method :smtp,
                    address: ENV["SMTP_SERVER"],
                    port: 587,
                    user_name: ENV["MAIL_USERNAME"],
                    password: ENV["MAIL_PASSWORD"],
                    enable_ssl: true
end

# send a message to the person letting them know we couldn't parse their message
def darn(message)
    $db.exec_params <<~SQL, [message.to_json]
        INSERT INTO donationzone.failedmail (json)
        VALUES ($1)
    SQL

    if message.from[0] == "giving@pcrf.net"
        puts "aaaaa"
        return
    end

    puts "failed to parse message: #{message.inspect})"

    reply = message.reply do
        body <<~MSG
            hello!! we couldn't manage to process your message. a staff member will go and add it manually
            "at some point".
        MSG
    end
    reply.deliver!

end

# reply confirming the amount donated and message
def confirm(mail, amount, message, name)
    store_amount(mail, amount, message, name)

    if mail.from[0] == "giving@pcrf.net"
        puts "#{name} is incredibly silly"
        return
    end

    puts "confirming #{mail.from[0]} (amount #{amount}, message: #{message.inspect})"

    reply = mail.reply do
        body <<~MSG
            you seem to have donated $#{amount}#{" with the message #{message}" if message}. many thanks!!
        MSG
    end
    reply.deliver!
end

def store_amount(mail, amount, message, name)
    from = mail.from[0]
    $db.exec_params <<~SQL, [name, amount.to_s, 'pcrf', message, from]
        INSERT INTO donationzone.donation (name, amount, cause, message, email)
        VALUES ($1, $2, $3, $4, $5)
    SQL
end

# reply confirming the amount donated and message
AmountRegexes = [
    /Amount paid\s+(?'amount'\p{Sc}\d+\.\d+)/i,
    /(\$)(?'amount'\d+(\.\d+)?)/i,
]

NameRegex = /Dear (?'name'.+),/i

$count = 0

Mail.find_and_delete(what: :last, count: 100) do |message|
    message.mark_for_delete = false

    $count += 1

    content = nil
    message.all_parts.each do |part|
        if part.mime_type == "text/plain"
            content = part.decoded
        end
    end

    if !message.multipart?
        content = message.decoded
    end

    dono_message = message.subject

    regex = AmountRegexes.find { |r|
        pp r.match content
        r.match(content)
    }
    if (!regex)
        darn(message)
        message.mark_for_delete = true
        next
    end
    amount = regex.match(content)['amount']

    if amount.nil?
        darn(message)
        message.mark_for_delete = true
        next
    end

    name = NameRegex.match(content)['name'] || 'Anonymous'

    pp amount, name

    confirm(message, amount, dono_message, name)

    message.mark_for_delete = true
end

puts "replied to #{$count} #{$count == 1 ? "message" : "messages"} 🫡"

