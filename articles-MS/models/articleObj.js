const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        trim: true
    },
    title: {
        type: String,
        require: true,
        minlength: 20,
        maxlength: 1000
    },
    description: {
        type: String,
        require: true,
        minlength: 500,
    },
    createdAt:{
        type: Date(),
        default: Date.now,
    },
    letShow: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Article", ArticleSchema, "articlesInfo");