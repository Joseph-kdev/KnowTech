import axios from "axios"

// const baseURL = "http://localhost:3001/"

const baseURL = "https://know-production.up.railway.app/"

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