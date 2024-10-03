const { client } = require("../config/redis-client")

function checkCache(customKey) {
    return async function(req, res, next) {
        const key = customKey
        try {
            const data = await client.get(key)
            if (data) {
                console.log("Returned from cache");
                return res.json(JSON.parse(data))
            }

            req.cacheKey = key
            next()
        } catch (error) {
            console.error("Error in cache middleware:", error);
            res.status(500).json({ error: 'An error occurred while checking the cache.' });
        }
    }

}

async function setCache(key, data) {
    try {
        await client.setEx(key, 1800, JSON.stringify(data))
        console.log(`data entered to cache: ${key}`);
    } catch (error) {
        console.error(`Error caching response: ${key}`, error);
    }
}

module.exports = {
    setCache,
    checkCache,
}