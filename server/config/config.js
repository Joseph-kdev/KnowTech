const { configDotenv } = require("dotenv");

configDotenv()

const GEMINI_API = process.env.GEMINI_KEY;
const PORT = process.env.PORT;
const redis_pwd = process.env.REDIS_PWD
const redis_host = process.env.REDIS_HOST

module.exports = {
    PORT,
    GEMINI_API,
    redis_pwd,
    redis_host
}