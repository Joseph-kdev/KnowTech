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


const addNewUrl = async(type, newUrl, userId) => {
    if (type === 'news') {
       const userFeedsRef = db.collection(`users/${userId}/news`);
       try {
           await userFeedsRef.add(({
            key: newUrl.key,
            value: newUrl.value
           }))
       } catch (error) {
           console.log("Error adding new url to Firestore: ", error)
           throw error
       }
    } else if (type === 'articles') {
        feedURLs.push(newUrl);
    }
  
};

const getFeedsData = async (type, userId) => {
   let urls = type === 'news' ? [...newsURLs] : feedURLs;

   if (type === "news" && userId) {
    const userFeedsRef = db.collection(`users/${userId}/news`);
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
