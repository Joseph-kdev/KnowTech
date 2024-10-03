const newsRoutes = require("./routes/newsRoutes")
const articleRoutes = require("./routes/articleRoutes")
const summaryRoutes = require("./routes/summaryRoutes")
const urlRoutes = require("./routes/urlRoutes")
const newsChatRoutes = require("./routes/newsChatRoutes")
const express = require("express")
const { client } = require("./config/redis-client");

(async () => { 
    await client.connect(); 
})(); 
  
console.log("Connecting to the Redis"); 
  
client.on("ready", () => { 
    console.log("Connected!"); 
}); 
  
client.on("error", (err) => { 
    console.log("Error in the Connection"); 
}); 

const app = express();
const cors = require("cors")

app.use(cors());
app.use(express.json())
app.use('/api/news', newsRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/chat', newsChatRoutes)
app.use('/api/summaries', summaryRoutes)
app.use('/api/updateFeeds', urlRoutes)

module.exports = app