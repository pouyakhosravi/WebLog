const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: {
        type: String,
        require: true,
        maxlength: 1000
    },
    text: {
        type: String,
        require: true,
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