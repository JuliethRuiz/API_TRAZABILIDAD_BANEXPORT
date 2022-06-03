require('dotenv').config()

const config = {
    apiKey: process.env.API_KEY,
    host: process.env.HOST,
    secure: process.env.SECURE,
    port: process.env.PORT,
    service: process.env.SERVICE,
    user:process.env.USER_SMTP,
    pass:process.env.PASS,
    urlServidor: process.env.SERVIDOR
}

module.exports = { config }