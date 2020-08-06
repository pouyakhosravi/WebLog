const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    name: String,
    family: String,
    email:{
        type: String,
        required: true
    },
    title: String,
    text: String,
    read: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Message", MessageSchema, "messageInfo");