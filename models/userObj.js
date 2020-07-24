const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const fs = require("fs");
const path = require("path");

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
        enum: ['اقا', 'خانم'],
        default: 'اقا'
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
    },
    country:{
        type: String,
        trim: true,
        default: "none"
    },
    mail:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    avatar: {
        type: String,
        default: "userDefault.jpg"
    }
});



// hash password before save
UserSchema.pre("save", function (next) {
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);

    next();
});

//delete last avatar
UserSchema.pre("findOneAndUpdate", async function (next) {

    try 
    {
        let thisUser = await this.findOne({_id: this._conditions._id});

        if(thisUser.avatar !== "userDefault.jpg")
        {
            try 
            {
                fs.unlinkSync(path.join(__dirname, `../public/Avatars/${thisUser.avatar}`));
            } 
            catch (error) 
            {
                console.log("خطا هنگام پاک کردن اواتار قبلی");
            }
        }
    } 
    catch (error) 
    {
        console.log("خطا: " + error.message);
    }

    next();
});

module.exports = mongoose.model('User', UserSchema, "usersInfo");