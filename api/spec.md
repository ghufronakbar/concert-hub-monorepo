# App NodeJS (ConcertHub API)
## Libs:
- axios
- cors
- crypto
- dotenv
- express
- ip
- jsonwebtoken
- md5
- multer
- mysql2

## Stuktur Folder
- bin/www.js (entry point)
- controllers/[domain]/[controller].js (route)
- images/* (image store) // image di store langsung dalam storage, dan tidak di gitignore
- middleware/*
- routes/[route].js (route)
- utils/*
- connection.js (database connection)
- .env
- package.json

## ENV
- PORT=<port>
- DB_HOST=<host>
- DB_USER=<user>
- DB_PASSWORD=<password> // or empty
- DB_NAME=<name>
- DB_PORT=<port>
- BASE_URL=http://<ipaddressv4>:<port> // or "https://<domain>"
- MIDTRANS_SERVER_KEY=<key>
- MIDTRANS_IS_PRODUCTION=<true/false>

## Domain
Domain will be "api-ch.lans.my.id"