const { checkCache, setCache } = require('../middleware/cache');
const { getFeedsData, fetchFeedsData } = require('../services/feedService');
const router = require('express').Router();

router.get('/',checkCache("news"), async (req, res) => {
    const userId = req.query.userId || null
    try {
        const newsData = userId ? await getFeedsData("news", userId) : await fetchFeedsData("news");
        await setCache(req.cacheKey, newsData)
        res.json(newsData);
    } catch (error) {
        console.error('Error fetching news feeds:', error);
        res.status(500).json({ error: 'Error fetching news feeds.' });
    }
});

module.exports = router

