const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
        minlength: 3
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
        minlength: 3
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 30,
        minlength: 3,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
        minlength: 8
    },
    sex: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 11
    },
    role: {
        type: String,
        enum: ['blogger', 'admin'],
        default: 'blogger'
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema, "usersInfo");