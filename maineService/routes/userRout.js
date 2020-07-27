const express = require("express");
const router = express.Router();
const path = require("path");
const userObj = require("../models/userObj.js");
const multer = require("multer");
const fs = require("fs");

// for use multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/Avatars");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const uploadAvatar = multer({storage: storage});

// uploadAvatar
router.put("/uploadAvatar", function (req, res) {
    const upload = uploadAvatar.single("avatar");

    upload(req, res, function (err) {
        if(err)
        {
            return res.status(400).send("خطا هنگام اپلود اواتار");
        }

        userObj.findOneAndUpdate({_id: req.session.user._id}, {avatar: req.file.filename}, {new: true}, function (err1, indentUser) {
            if(err1)
            {
                return res.status(500).send("خطا هنگام اپدیت اواتار در دیتا بیس.");
            }
            else
            {
                // update avatar in session
                req.session.user.avatar = req.file.filename;
                return res.send(indentUser);
            }
        })

    });
});


// get dashboard page
router.get("/dashboard", function (req, res) {
    res.render( path.join(__dirname, "../views/pages/dashboard.ejs"), {user: req.session.user} )
});


// search for duplicate username
router.get("/FindUser/:username", async function (req, res) {
    try 
    {
        // if in user name there is upper case 
        if((req.params.username).match(/[A-Z]/g))
        {
            throw new Error("نام کاربری فقط باید با حروف کوچک باشد.")
        }

        // if fine duplicate user name
        if((req.params.username).length > 2 && (req.params.username).length < 31)
        {            
            let findDuplicateUserName = await userObj.findOne({userName: req.params.username})
            
            if(findDuplicateUserName)
            {
                res.send(true);
            }
            else
            {
                res.send(false);
            }
        }
    } 
    catch (error) 
    {
        res.send(error.message);
    }
});

module.exports = router;