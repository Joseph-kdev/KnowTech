import axios from "axios"

// const baseURL = "https://blogs-rs-sfeed-back.vercel.app/"

const baseURL = "http://localhost:3001/"

export const getFeeds = async(type, userId) => {
        const news = await axios.get(`${baseURL}api/${type}`, { params: { userId } })
        return news.data
}

export const addRSSFeed = async(urlDetails) => {
    const news = await axios.post(`${baseURL}api/updateFeeds`, urlDetails)
    return news.data
}
