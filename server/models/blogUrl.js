const mongoose = require('mongoose');

const blogUrlSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    rssUrl: {
        type: String,
        required: true
    },
    rssUrlKey: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('BlogUrl', blogUrlSchema)