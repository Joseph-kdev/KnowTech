const RSSparser = require("rss-parser")

const parser = new RSSparser();

const parseFeed = async (feedInfo) => {
    if (!feedInfo || typeof feedInfo !== 'object') {
        console.error('Invalid feed info:', feedInfo);
        return {};
    }
    try {
        const { key, value } = feedInfo;
        if (!key || !value) {
            console.error('Feed info missing key or value:');
            return {};
        }
        const feed = await parser.parseURL(value);
        return { [key]: feed.items };
    } catch (error) {
        console.error(`Error parsing feed ${feedInfo.key}:`, error);
        return { [feedInfo.key]: [] };
    }
};

const parseFeeds = async (feeds) => {
    const parsePromises = feeds.map(parseFeed);
    const results = await Promise.all(parsePromises);
    return Object.assign({}, ...results);
};

module.exports = { parseFeeds };
