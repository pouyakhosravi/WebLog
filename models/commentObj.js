const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    text: {
        type: String,
        maxlength: 1000,
        required: true
    },
    whoIs:{
        type: String,
        required: true,
        trim: true
    },
    letShow: {
        type: Boolean,
        default: false
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: "Article",
        required: true,
    }
});

module.exports = mongoose.model("Comments", CommentsSchema, "commentsInfo")