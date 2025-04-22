const { checkCache, setCache } = require('../middleware/cache');
const { getFeedsData, fetchFeedsData } = require('../services/feedService');
const router = require('express').Router();

router.get('/',checkCache("articles"), async (req, res) => {
    const userId = req.query.userId || null
    try {
        const articlesData = userId ? await getFeedsData("articles", userId) : await fetchFeedsData("articles");
        await setCache(req.cacheKey, articlesData)
        res.json(articlesData);
    } catch (error) {
        console.error('Error fetching article feeds:', error);
        res.status(500).json({ error: 'Error fetching article feeds.' });
    }
});

module.exports = router;