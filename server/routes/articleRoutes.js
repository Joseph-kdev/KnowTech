const { getFeedsData } = require('../services/feedService');
const router = require('express').Router();

router.get('/', async (req, res) => {
    const userId = req.query.userId
    try {
        const articlesData = await getFeedsData('articles', userId);
        res.json(articlesData);
    } catch (error) {
        console.error('Error fetching article feeds:', error);
        res.status(500).json({ error: 'Error fetching article feeds.' });
    }
});

module.exports = router;