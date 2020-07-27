const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
    },
    description: {
        type: String,
        require: true,
        minlength: 20,
        maxlength: 1000
    },
    text: {
        type: String,
        require: true,
        minlength: 500,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    letShow: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Article", ArticleSchema, "articlesInfo");