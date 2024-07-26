const newsRoutes = require("./routes/newsRoutes")
const articleRoutes = require("./routes/articleRoutes")
const summaryRoutes = require("./routes/summaryRoutes")
const urlRoutes = require("./routes/urlRoutes")
const express = require("express")

const app = express();
const cors = require("cors")


app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json())

app.use('/', articleRoutes)
app.use('/api/news', newsRoutes)
app.use('/summaries', summaryRoutes)
app.use('/api/updateFeeds', urlRoutes)

module.exports = app