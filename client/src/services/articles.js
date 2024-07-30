import axios from "axios"

// const baseURL = "https://blogs-rs-sfeed-back.vercel.app/"

const baseURL = "http://localhost:3001/"

export const getFeeds = async(type, userId) => {
        const feeds = await axios.get(`${baseURL}api/${type}`, { params: { userId } })
        return feeds.data
}

export const addRSSFeed = async(urlDetails) => {
    const news = await axios.post(`${baseURL}api/updateFeeds`, urlDetails)
    return news.data
}

export const chatAboutNews = async({ messages, inputValue}) => {
    const chat = await axios.post(`${baseURL}api/chat`, {
        history: messages,
        message: inputValue
    })
    return chat.data
}