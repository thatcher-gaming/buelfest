require "net/imap"
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

def confirm(message, amount)
  mail = message.reply do
    body <<~MSG
      you seem to have donated #{amount}. many thanks!!
    MSG
  end
  puts mail
  mail.deliver!
end

AmountRegex = /Amount paid\s+(?'amount'\p{Sc}\d+\.\d+)/i

Mail.find_and_delete do |message|
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
  match = AmountRegex.match(encoded)

  if match['amount'].nil?
    darn(message)
    next
  end

  confirm(message, match['amount'])
end
