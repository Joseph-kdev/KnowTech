const router = require('express').Router();
const BlogUrl = require('../models/blogUrl');

router.post('/', async (req, res) => {
    const { user, rssUrl, rssUrlKey } = req.body;
    try {
        const blogUrl = new BlogUrl({ user, rssUrl, rssUrlKey });
        await blogUrl.save();
        res.send(blogUrl);
    } catch (error) {
        console.error('Error saving blog url:', error);
        res.status(500).json({ error: 'Error saving blog url.' });
    }
});

module.exports = router;