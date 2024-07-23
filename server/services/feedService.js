const { parseFeeds } = require("../utils/rssParser");
const newsURLs = [
    {
        key: "theVerge",
        value: "https://www.theverge.com/rss/index.xml"
    },
    {
        key: "techCrunch",
        value: "https://techcrunch.com/feed"
    },
    {
        key: "hackerNews",
        value: "https://thehackernews.com/feeds/posts/default"
    },
]

const feedURLs = [
    {   
        key: "bytebytego",
        value:"https://blog.bytebytego.com/feed",
    },
    {
        key: "logRocket",
        value:"https://blog.logrocket.com/feed",
    },
    {
        key: "codingHorror",
        value:"https://blog.codinghorror.com/rss"
    },
]

const feedsCache = {
    news: {},
    articles: {}
}

const addNewUrl = (type, newUrl) => {
    if (type === 'news') {
        newsURLs.push(newUrl);
        console.log(`${newUrl} added successfully`);
    } else if (type === 'articles') {
        feedURLs.push(newUrl);
    }
    // Clear the cache for this type to force a refresh on next fetch
    feedsCache[type] = {};
};

const getFeedsData = async (type) => {
    if (Object.keys(feedsCache[type]).length === 0) {
        feedsCache[type] = await parseFeeds(type === 'news' ? newsURLs : feedURLs);
    }
    return feedsCache[type];
};

module.exports = {getFeedsData , addNewUrl}
