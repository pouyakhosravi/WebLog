const express = require("express");
const router = express.Router();
const path = require("path");
const articleObj = require("../models/articleObj.js");
const commentObj = require("../models/commentObj.js");
const accessControl = require("../tools/accessControl.js");
const ACCESS_CONTROL = require("../tools/accessControl.js");

// send confirm page
router.get("/allNotApproved", accessControl.checkAdmin,  function (req, res) {
    articleObj.find({letShow: false}).populate("author", {firstName: 1, lastName: 1}).exec((err, articles) => {
        if(err) return res.status(500).send("خطا هنگام دریافت مقاله های تایید نشده.");

        res.render( path.join(__dirname, "../views/pages/confirmPage.ejs"), {comments: "", articles: articles, messages: "", users: ""} );
    })
});


// get all article for show every one
router.get("/all", function (req, res) {

    articleObj.find({letShow: true}).sort({createdAt: -1}).populate("author", {firstName: 1, lastName: 1, avatar: 1, createdAt: 1}).exec(function (err, articles) {
        if(err)
        {
            return res.status(500).send("خطا هنگام دریافت تمام مقاله ها");
        }
        else
        {
            return res.render( path.join(__dirname, "../views/pages/all.ejs"), {articles: articles, users: ""} );
        }
    });

});


// get crate page
router.get("/newArticle", function (req, res) {
    return res.render( path.join(__dirname, "../views/pages/newArticle.ejs") );
});


// get read article page
let article;
let articleID;
router.get("/readArticle/:articleID", async function (req, res) {

    try 
    {
        articleID = req.params.articleID;

        let comments = await commentObj.find({article: articleID, letShow: true});

        article = await articleObj.findById(articleID);

        return res.render( path.join(__dirname, "../views/pages/readArticlePage.ejs"), {article: article, comments: comments} )
    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).send("خطا هنگام دریافت این مقاله")
    }
    
});

router.get("/publicReadPage/:articleID", async function (req, res) {
    articleID = req.params.articleID;
    let comments;

    // get comments this article
    try 
    {
        comments = await commentObj.find({article: articleID, letShow: true});
    } 
    catch (error) 
    {
        return res.status(500).send("خطا هنگام دریافت کامت ها");
    }

    articleObj.findById(articleID).populate("author", {firstName: 1, lastName: 1, sex: 1, avatar: 1}).exec(function (err, article) {
        if(err)
        {
            res.status(500).send("خطا هنگام دریافت مقاله");
        }
        else
        {
            res.render( path.join(__dirname, "../views/pages/read&comment.ejs"), {article: article, comments: comments} );
        }
    })
});


// create Article
router.post("/", function (req, res) {

        if(!req.body.title)
        {
            return res.status(400).send("عنوان مقاله خود را مشخص کنید.");
        }

        let title = req.body.title;
        if(title.length > 1000)
        {
            return res.status(500).send("خلاصه مقاله باید کمتر از 1000 کاراکتر باشد.")
        }


        // save to db
        let NEW_ARTICLE = new articleObj({
            author: req.session.user._id,
            description: req.body.title,
            text: req.body.content
        });

        if(req.session.user.role === "admin")
        {
            NEW_ARTICLE.letShow = true;
        }

        NEW_ARTICLE.save(function (err, user) {
            if(err)
            {
                return res.status(500).send("خطا هنگام سیو مقاله جدید.")
            }
            else
            {
                //pass to dashboard
                res.send("ثبت مقاله شما با موفقیت انجام شد");
            }
        })
});


// just admin can confirm a article 
router.put("/submit", ACCESS_CONTROL.checkAdmin, async (req, res) => {
    articleID = req.body.id;
    try 
    {
        await articleObj.findByIdAndUpdate({_id: articleID}, {letShow: true});

        return res.send("مقاله با موفقیت تایید شد");
    } 
    catch (error) 
    {
        res.status(500).send("خطا هنگام تایید مقاله");
    }
});

// update article
router.put("/", async function (req, res) {
    try 
    {
        articleID = req.body.articleID.trim();
        await articleObj.findByIdAndUpdate({_id: articleID}, {description: req.body.title, text: req.body.text});
        res.send("مقاله شما با موفقیت ویرایش شد.");
    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).send("خطا هنگام اپیدیت مقاله");
    }
});


// delete article
router.delete("/:articleID", (req, res) => {
    articleID = req.params.articleID;

    articleObj.findByIdAndRemove(articleID, function (err, deleteResult) {
        if(err)
        {
            return res.status(500).send("خطا هنگام حذف مقاله");
        }
        else
        {
            res.send("مقاله حذف شد")
        }
    })
});

module.exports = router;