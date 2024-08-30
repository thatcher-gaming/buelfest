require 'dotenv/load'
require 'mail'

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

AmountRegex = /Amount paid\s+(?'amount'\p{Sc}\d+\.\d+)/i

count = 0

Mail.find_and_delete do |message|
  count += 1

  body = if message.multipart?
    part = message.parts.find { |p| p.content_type.start_with? "text/plain" }
    part.body if part
  else
    message.body if message.body.content_type == "text/plain"
  end

  if body.nil?
    darn(message)
    next
  end

  encoded = body.to_s.force_encoding('utf-8')

  first_line = encoded.lines[0].strip
  dono_message = first_line unless first_line.empty?

  match = AmountRegex.match(encoded)

  if match['amount'].nil?
    darn(message)
    next
  end

  confirm(message, match['amount'], dono_message)
end

puts "replied to #{count} #{count == 1 ? "message" : "messages"} 🫡"

# send a message to the person letting them know we couldn't parse their message
def darn(message)
  
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
