import axios from "axios"

// const baseURL = "https://blogs-rs-sfeed-back.vercel.app/"

const baseURL = "http://localhost:3001/"

export const getArticles = async() => {
    const articles = await axios.get(baseURL)
    return articles.data
}

export const getNews = async() => {
    const news = await axios.get(`${baseURL}news`)
    return news.data
}

export const addRSSFeed = async(urlDetails) => {
    const news = await axios.post(`${baseURL}saveurl`, urlDetails)
    return news.data
}
