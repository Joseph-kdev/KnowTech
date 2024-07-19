const newsRoutes = require("./routes/newsRoutes")
const articleRoutes = require("./routes/articleRoutes")
const summaryRoutes = require("./routes/summaryRoutes")

const express = require("express")
const cors = require("cors")

const app = express();

app.use(cors())
app.use(express.json())

app.use('/', articleRoutes)
app.use('/news', newsRoutes)
app.use('/summaries', summaryRoutes)

module.exports = app