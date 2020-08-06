const express = require("express");
const router = express.Router();
const path = require("path");
const userRoute = require("./userRout.js");
const commentRoute = require("./commentRoute.js");
const articleRoute = require("./articleRoute.js");
const messageRoute = require("./messageRout.js");
const userObj = require("../models/userObj.js");
const messageObj = require("../models/messageObj.js");
const bcrypt = require('bcryptjs');

//pass to userRout
router.use("/user", checkSession, userRoute);
router.use("/article", checkSession, articleRoute);
router.use("/comment", checkSession, commentRoute);
router.use("/message", checkSession, messageRoute);


//============ create message ==============
router.post("/adminMessage", async function (req, res) {
    
    try 
    {
        if(!req.body.mail)
        {
            return res.status(400).send("ایمیل الزامی میباشد.");
        }
    
        const NEW_MESSAGE = new messageObj({
            name: req.body.name,
            family: req.body.family,
            email: req.body.mail,
            title: req.body.title,
            text: req.body.text
        });
    
        await NEW_MESSAGE.save();

        return res.send("ثبت پیام با موفقیت انجام شد.")
    } 
    catch (error) 
    {
        res.status(500).send("خطا هنگام سیو پیام کاربر");
    }

})


// ========= about us ============
router.get("/aboutUs", function (req, res) {
    res.render( path.join(__dirname, "../views/pages/aboutUs.ejs"), {isLoggedIn: req.session.user} );
})


//==============LOGIN==================

//login
router.post("/logIn", isLoggedIn, async function (req, res) {
    try 
    {
        // check there is data
        if(!req.body.userName || !req.body.password)
        {
            throw new Error("فیلد های خالی را پر کنید.");
        }

        const BLOGGER = await userObj.findOne({userName: req.body.userName});

        if (!BLOGGER || !bcrypt.compareSync(req.body.password, BLOGGER.password)) {
            throw new Error("کاربری با این مشخصات ثبت نشده.")
        };

        // set session
        req.session.user = BLOGGER;

        //pass to dashboard
        res.redirect("/api/user/dashboard");
    } 
    catch (error) 
    {
        res.status(500).send(error.message);
    }
});


//LogOut
router.get("/logout", function (req, res) {
    if(req.session.user && req.cookies.user_sid)
    {
        res.clearCookie("user_sid");
        res.redirect("/");
    }
    else
    {
        res.redirect("/")
    }
});


//===============SING UP=================

//get singUp page
router.get("/singUp", isLoggedIn, function (req, res) {
    res.render( path.join(__dirname, "../views/pages/singUp.ejs"));
});



//create new blogger
router.post("/singUp", isLoggedIn, async function (req, res) {
    try 
    {
        // check empty field
        if(!req.body.userName || !req.body.firstName || !req.body.lastName || !req.body.password || !req.body.retryPassword || !req.body.country || !req.body.sex || !req.body.mobile || !req.body.mail)
        {
            throw new Error("فیلد های خالی را پر کنید.")
        }

        // check length
        if((req.body.firstName).length < 3 || (req.body.firstName).length > 30 || (req.body.lastName).length < 3 || (req.body.lastName).length > 30 || (req.body.password).length < 8 || (req.body.password).length > 30 || (req.body.retryPassword).length < 8 || (req.body.retryPassword).length > 30 || (req.body.mobile).length !== 10 || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(req.body.mail))
        {
            throw new Error("خطای ورودی: وردی های خود را چک کنید")
        }

        // check pass valid
        if((req.body.password).trim() != (req.body.retryPassword).trim())
        {
            throw new Error("رمز عبور صحیح نمیباشد")
        }

        // check for duplicate blogger
        let BLOGGER = await userObj.findOne({userName: (req.body.userName).trim().toLowerCase()});
        if(BLOGGER)
        {
            throw new Error("این نام کاربری قبل ثبت شده است.");            
        }

        // check for duplicate mail
        BLOGGER = await userObj.findOne({mail: (req.body.mail).trim().toLowerCase()});
        if(BLOGGER)
        {
            throw new Error("این ایمیل قبلا ثبت شده است");            
        }

        // check for duplicate phone
        BLOGGER = await userObj.findOne({mobile: (req.body.mobile).trim().toLowerCase()});
        if(BLOGGER)
        {
            throw new Error("این شماره قبلا ثبت شده است");            
        }

        const NEW_BLOGGER = new userObj({
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            sex: req.body.sex,
            mobile: req.body.mobile,
            mail: req.body.mail,
            country: req.body.country
        });

        await NEW_BLOGGER.save();

        res.redirect("/")
    } 
    catch (error) 
    {
        res.status(500).send(error.message);
    }
});


//pass to dash board if user logged in 
function isLoggedIn(req, res, next) {
    if(req.session.user)
    {
        return res.redirect("/api/user/dashboard");
    }
    next();
}


//pass to sing up if use do not logged in
function checkSession(req, res, next) {

    if(!req.session.user && req.url === "/dashboard")
    {
        return res.redirect("/");
    }
    else if(!req.session.user && req.url === "/newArticle")
    {
        return res.redirect("/");
    }
    else if(!req.session.user && req.params)
    {
        if((req.url).split("/")[1] !== "FindUser" && req.url !== "/all" && (req.url).split("/")[1] !== "publicReadPage" && req.url !== "/" && req.url !== "/getAll")
        {
            return res.redirect("/");
        }
    }
    next();
}

module.exports = router;