const { createClient } = require("redis")
const { redis_pwd, redis_host } = require("./config")

const client = createClient({
    password: `${redis_pwd}`,
    socket: {
        host: `${redis_host}`,
        port: 13816
    }
})

module.exports = {
    client
}