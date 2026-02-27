import axios from "axios"

const baseURL = "http://localhost:3001/"

// const baseURL = import.meta.env.VITE_BACKEND_URL

export const getFeeds = async (type, userId) => {
    const feeds = await axios.get(`${baseURL}api/${type}`, { params: { userId } })
    return feeds.data
}

export const fetchFeeds = async (type) => {
    const feeds = await axios.get(`${baseURL}api/${type}`)
    return feeds.data
}

export const addRSSFeed = async (urlDetails) => {
    const news = await axios.post(`${baseURL}api/updateFeeds`, urlDetails)
    return news.data
}

export const chatAboutNews = async ({ messages, inputValue }) => {
    const chat = await axios.post(`${baseURL}api/chat`, {
        history: messages,
        message: inputValue
    })
    return chat.data
}

export const chatAboutNewsStream = async ({ messages, inputValue, onChunk }) => {
    const response = await fetch(`${baseURL}api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            history: messages,
            message: inputValue
        })
    });

    if (!response.ok) {
        throw new Error("Failed to start chat stream");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // The SSE chunk might contain multiple "data: " messages
        const sseMessages = chunk.split('\n\n');

        for (const msg of sseMessages) {
            if (msg.startsWith('data: ')) {
                const dataStr = msg.replace('data: ', '');
                if (dataStr === '[DONE]') {
                    return; // Stream complete
                }

                try {
                    const data = JSON.parse(dataStr);
                    if (data.error) {
                        throw new Error(data.error);
                    }
                    if (data.text) {
                        onChunk(data.text);
                    }
                } catch (e) {
                    console.error("Error parsing SSE data:", e, dataStr);
                }
            }
        }
    }
}