const newsRoutes = require("./routes/newsRoutes")
const articleRoutes = require("./routes/articleRoutes")
const summaryRoutes = require("./routes/summaryRoutes")
const urlRoutes = require("./routes/urlRoutes")
const express = require("express")

const app = express();
const cors = require("cors")
const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

const URI = process.env.MONGO_URI

mongoose.connect(URI)
    .then(() => {
        console.log("connected to MongoDB")
    })
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.message)
    })


app.use(cors())
app.use(express.json())

app.use('/', articleRoutes)
app.use('/news', newsRoutes)
app.use('/summaries', summaryRoutes)
app.use('/saveurl', urlRoutes)

module.exports = app