require 'dotenv/load'
require 'mail'
require 'pg'

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
  
end

# reply confirming the amount donated and message
def confirm(mail, amount, message)
  reply = mail.reply do
    body <<~MSG
      you seem to have donated #{amount}#{" with the message #{message}" if message}. many thanks!!
    MSG
  end
  puts reply
  reply.deliver!
end

AmountRegexes = [
  /Amount paid\s+(?'amount'\p{Sc}\d+\.\d+)/i,
  /kind donation of (?'amount'(\$)\d+(\.\d+)? \w+)/,
]

count = 0

Mail.find(what: :last, count: 100) do |message|
  count += 1

  body = if message.multipart?
    part = message.parts.find { |p| p.content_type.start_with? "text/plain" }
    part.body if part
  else
    message.body 
  end

  if body.nil?
    darn(message)
    next
  end

  encoded = body.to_s.force_encoding('utf-8')

  first_line = encoded.lines[0].strip
  dono_message = first_line unless first_line.empty?

  regex = AmountRegexes.find { |r| r.match(encoded) }
  if (!regex)
    darn(message)
    next
  end
  match = regex.match(encoded)

  if match['amount'].nil?
    darn(message)
    next
  end

  message.
  confirm(message, match['amount'], dono_message)
end

puts "replied to #{count} #{count == 1 ? "message" : "messages"} 🫡"

# send a message to the person letting them know we couldn't parse their message
def darn(message)
  puts "failed to parse message: #{message.inspect})"

  reply = mail.reply do
    body <<~MSG
      hello!! we couldn't manage to process your message. w staff member will go and add it manually
      "at some point".
    MSG
  end
  reply.deliver!
end

# reply confirming the amount donated and message
def confirm(mail, amount, message)
  puts "confirming #{mail.from[0]} (amount #{amount}, message: #{message.inspect})"

  reply = mail.reply do
    body <<~MSG
      you seem to have donated #{amount}#{" with the message #{message}" if message}. many thanks!!
    MSG
  end
  reply.deliver!
end

def store_amount(mail, amount, message)
  $db.exec_params <<~SQL, [mail.from, amount.to_s, 'pcrf', message, mail.to_s]
    INSERT INTO donations (name, amount, cause, message, raw)
    VALUES ($1, $2, $3, $4, $5)
  SQL
end