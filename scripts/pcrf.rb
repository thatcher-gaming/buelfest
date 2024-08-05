require "net/imap"
require 'dotenv/load'

imap = Net::IMAP.new ENV["IMAP_SERVER"], ssl: true
imap.authenticate("plain", ENV["IMAP_USERNAME"], ENV["IMAP_PASSWORD"])

imap.examine('INBOX')
imap.search(["RECENT"]).each do |message_id|
  body = imap.fetch(message_id, "BODY[TEXT]")[0].attr["BODY[TEXT]"]

  puts body
end
