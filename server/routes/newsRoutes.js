const { getFeedsData } = require('../services/feedService');
const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const newsData = await getFeedsData('news');
        res.json(newsData);
    } catch (error) {
        console.error('Error fetching news feeds:', error);
        res.status(500).json({ error: 'Error fetching news feeds.' });
    }
});

module.exports = router;