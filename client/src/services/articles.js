import axios from "axios"

// const baseURL = "https://blogs-rs-sfeed-back.vercel.app/"

const baseURL = "http://localhost:3001/"

export const getArticles = async() => {
    const articles = await axios.get(baseURL)
    return articles.data
}

export const getNews = async(userId) => {
        const news = await axios.get(`${baseURL}api/news`, { params: { userId } })
        console.log(news.data);
        return news.data
}

export const addRSSFeed = async(urlDetails) => {
    const news = await axios.post(`${baseURL}api/updateFeeds`, urlDetails)
    return news.data
}
