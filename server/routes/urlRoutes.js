const router = require('express').Router();
const { addNewUrl } = require('../services/feedService');
const { invalidateCache } = require('../middleware/cache');


router.post('/', async(req, res) => {
    const { user, rssUrl, rssUrlKey, contentType } = req.body;

    if (!user || !rssUrl || !rssUrlKey) {
        return res.status(400).send('Missing required fields');
    }

    const newUrl = {
        key: rssUrlKey,
        value: rssUrl
    }

    try {
        await addNewUrl(newUrl, user, contentType);
        invalidateCache(contentType)
        console.log('URL added successfully');
        res.status(200).send('URL added successfully');
    } catch (error) {
        console.error('Error adding URL:', error.message, error.stack);
        res.status(500).send(`Error adding URL: ${error.message}`);
    }
});

module.exports = router;