const express = require("express");
const router = express.Router();
const path = require("path");
const userObj = require("../models/userObj.js");
const articleObj = require("../models/articleObj.js");
const commentObj = require("../models/commentObj.js");
const messageObj = require("../models/messageObj.js");
const multer = require("multer");
const bcrypt = require('bcryptjs');


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


// update pro
router.put("/updatePro", (req, res) => {

    userObj.findByIdAndUpdate({_id: req.session.user._id}, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        sex: req.body.sex,
        mobile: req.body.mobile,
        country: req.body.country,
        mail: req.body.mail
    }, {new: true}, async (err, updateUser) => {
        if(err) return res.status(500).send("خطا هنگام اپدیت پروفای");

        req.session.user = updateUser;
        
        return res.send("اپدیت با موفقیت انجام شد.");
    });
    
});


// update password
router.put("/updatePassword", async (req, res) => {
    // check empty field
    if(!req.body.lastPassword || !req.body.newPassword)
    {
        return res.status(500).send("دو فیلد پسوورد الزامی میباشد.");
    }

    //check validation
    if((req.body.lastPassword).trim().length < 8 || (req.body.newPassword).trim().length < 8)
    {
        return res.status(500).send("طول فیلد ها باید بیشتر از 8 کاراکتر باشد");
    }

    if((req.body.lastPassword).trim() === (req.body.newPassword).trim())
    {
        return res.status(500).send("رمز عبور جدید شما تکراری میباشد.");
    }

    let salt = bcrypt.genSaltSync(10);
    let newHashedPassword = bcrypt.hashSync( (req.body.newPassword).trim(), salt );

    if( bcrypt.compareSync((req.body.lastPassword).trim(), req.session.user.password) )
    {
        try 
        {
            let user = await userObj.findByIdAndUpdate(req.session.user._id, {password: newHashedPassword}, {new: true})

            req.session.regenerate((err) => {
                if(err) return res.status(500).send("خطایی رخ داده");

                req.session.user = user
            });

            return res.send("اپدیت پسوورد شما با موفقیت انجام شد شما باید دوباره ورد کیند.")
        } 
        catch (error) 
        {
            res.status(500).send("خطا هنگام اپدیت پسوورد")
        }
    }
    else
    {
        res.status("403").send("رمز عبرو فعلی شما درست نمیباشد");
    }
});


// update password from admit
let userID;
router.put("/adminUpdater", async (req, res) => {

    try 
    {
        userID = req.body.id; //get id

        // find user and get the pass
        let user = await userObj.findById(userID);
        let thisUserPhone = user.mobile;

        let salt = bcrypt.genSaltSync(10);
        let newPassword = bcrypt.hashSync(thisUserPhone, salt);

        await user.updateOne({password: newPassword});

        return res.send("رمز عبور این کار بر به شماره موبایل خودش تغییر کرد.")
    } 
    catch (error) 
    {
        return res.status(500).send("خطا هنگام تغییر پسوورد این کاربر.")
    }
    
});


// get edit profile page
router.get("/editProfile", (req, res) => {
    res.render( path.join(__dirname, "../views/pages/editProfile.ejs"), {user: req.session.user} );
})

// get dashboard page
router.get("/dashboard", async function (req, res) {

    try 
    {
        let bloggerID = req.session.user._id;
        let articles = await articleObj.find({author : bloggerID});

        let articleCount = await articleObj.countDocuments({letShow: false});
        let commentCount = await commentObj.countDocuments({letShow: false});
        let messageCount = await messageObj.countDocuments({read: false});

        res.render( path.join(__dirname, "../views/pages/dashboard.ejs"), {user: req.session.user, articles: articles, articleCount: articleCount, messageCount: messageCount, commentCount: commentCount} )
    } 
    catch (error) 
    {
        res.status(500).send("خطای هنگام پیداکردن مقاله ها")
    }
});

// get all user
router.get("/getAll", async function (req, res) {
    try 
    {
        let users = await userObj.find();

        res.render( path.join(__dirname, "../views/pages/all.ejs"), {users: users, articles: ""} );
    } 
    catch (error) 
    {
        res.status(500).send("خطا هنگام دریاف لیست کاربران");
    }
});


//get all suer for admin 
router.get("/allUserForAdmin", async function (req, res) {
    try 
    {
        let users = await userObj.find({role: "blogger"});

        res.render( path.join(__dirname, "../views/pages/confirmPage.ejs"), {articles: "", comments: "", messages: "", users: users} );
    } 
    catch (error) 
    {
        res.status(500).send("خطا هنگام دریاف لیست کاربران");
    }
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
        return res.send(error.message);
    }
});

router.delete("/deleteUser/:userID", async (req, res) => {

    userID = req.params.userID;
    try 
    {
        await userObj.findByIdAndDelete(userId);

        return res.send("کاربر بار موفقیت حذف شد");
    } 
    catch (error) 
    {
        console.log(error);
        return res.send("خطا هنگام حذف بلاگر")
    }

});

module.exports = router;