const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectID,
        required: true,
    }
});

module.exports = mongoose.model("Comments", CommentsSchema, "CommentsInfo")