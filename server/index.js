const cors = require("cors")
const RSSparser = require("rss-parser")
const express = require("express")
const genAI = require("./gemini-start")
const config = require("./utils/config")

const app = express();

app.use(cors())
app.use(express.json())

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
        value: "https://news.ycombinator.com/rss"
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

const parser = new RSSparser();
const feedsCache = {
    news: {},
    articles: {}
}

const parseFeed = async (feedInfo) => {
    try {
        const { key, value } = feedInfo;
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

const getFeedsData = async (type) => {
    if (Object.keys(feedsCache[type]).length === 0) {
        feedsCache[type] = await parseFeeds(type === 'news' ? newsURLs : feedURLs);
    }
    return feedsCache[type];
};

app.get('/', async (req, res) => {
    try {
        const articlesData = await getFeedsData('articles');
        res.json(articlesData);
    } catch (error) {
        console.error('Error fetching article feeds:', error);
        res.status(500).json({ error: 'Error fetching article feeds.' });
    }
});

app.get('/news', async (req, res) => {
    try {
        const newsData = await getFeedsData('news');
        res.json(newsData);
    } catch (error) {
        console.error('Error fetching news feeds:', error);
        res.status(500).json({ error: 'Error fetching news feeds.' });
    }
});

app.post('/summaries', async(req, res) => {
    const { actualUrl } = req.body
    const model = genAI.getGenerativeModel({ model: "gemini-pro"})

    const prompt = `Summarize this blog ${actualUrl} in a concise and informative
                    way. In your summary start with the blog's title as a heading.
                    At the end of your summary always include a key takeaways section
                    for the blog.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    res.send(text)
})


const server = app.listen(config.PORT, () => {
    console.log(`server running at ${config.PORT}`);
})