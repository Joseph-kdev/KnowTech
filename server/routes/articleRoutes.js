const { getFeedsData } = require('../services/feedService');
const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const articlesData = await getFeedsData('articles');
        res.json(articlesData);
    } catch (error) {
        console.error('Error fetching article feeds:', error);
        res.status(500).json({ error: 'Error fetching article feeds.' });
    }
});

module.exports = router;