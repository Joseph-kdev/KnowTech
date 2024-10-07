const db = require("../config/firebaseConfig");
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
    {
        key: "LifeHacker",
        value: "https://lifehacker.com/feed/rss",
      },
    //   {
    //     key: "Ars Technica",
    //     value: "http://feeds.arstechnica.com/arstechnica/index",
    //   },
      {
        key: "Mashable",
        value: "https://mashable.com/feeds/rss/all",
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
    // {
    //     key: "SitePoint",
    //     value: "https://www.sitepoint.com/sitepoint.rss"
    // },
]


const addNewUrl = async( newUrl, userId, contentType) => {
       const userFeedsRef = db.collection(`users/${userId}/${contentType}`);
       console.log(`Added to ${contentType} feed`);
       try {
           await userFeedsRef.add(({
            key: newUrl.key,
            value: newUrl.value
           }))
       } catch (error) {
           console.log(`Error adding new ${contentType} url to Firestore: `, error)
           throw error
       }
  
};

const getFeedsData = async (type, userId) => {
   let urls = type === 'news' ? [...newsURLs] : [...feedURLs];

   if (type && userId) {
    const userFeedsRef = db.collection(`users/${userId}/${type}`);
    const userFeedsSnapshot = await userFeedsRef.get();
    const userFeeds = userFeedsSnapshot.docs.map(doc => ({
        key: doc.data().key,
        value: doc.data().value
   }))
   urls = [...userFeeds, ...urls];
   }

   return await parseFeeds(urls);
};

module.exports = {getFeedsData , addNewUrl}
