# running da scripts.

install ruby and bundler, make a .env file like below and run it with
`ruby pcrf.rb`.

```properties
IMAP_SERVER=mail.pronounmail.com
SMTP_SERVER=mail.pronounmail.com
MAIL_USERNAME=buelfest
MAIL_PASSWORD=XXX
SMTP_FROM=buelfest@pronounmail.com
PG_URI=postgresql://user:XXX@example.com:1234/buelfest?sslmode=require
```

note: you might need to install pgsql-dev or whatever it is on your distro.

ok thanks
