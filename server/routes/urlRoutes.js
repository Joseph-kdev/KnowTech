const router = require('express').Router();
const BlogUrl = require('../models/blogUrl');
const { addNewUrl } = require('../services/feedService');



router.post('/', async (req, res) => {
    const { user, rssUrl, rssUrlKey } = req.body;
    try {
        const blogUrl = new BlogUrl({ user, rssUrl, rssUrlKey });
        await blogUrl.save();

        const newsRssUrl = {
            key: rssUrlKey,
            value: rssUrl
        }
        addNewUrl('news', newsRssUrl);
        res.status(201).json({
            message: 'Blog URL added successfully',
            newsRssUrl });
    } catch (error) {
        console.error('Error saving blog url:', error);
        res.status(500).json({ error: 'Error saving blog url.' });
    }
});

module.exports = router;