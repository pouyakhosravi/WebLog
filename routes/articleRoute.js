const express = require("express");
const router = express.Router();
const path = require("path");
const articleObj = require("../models/articleObj.js");


// get crate page
router.get("/newArticle", function (req, res) {
    return res.render( path.join(__dirname, "../views/pages/newArticle.ejs") );
});

// ger read article page
let article;
router.get("/readArticle/:articleID", async function (req, res) {

    try 
    {
        let articleID = req.params.articleID;
        article = await articleObj.findById(articleID);

        return res.render( path.join(__dirname, "../views/pages/readArticlePage.ejs"), {article: article} )
    } 
    catch (error) 
    {
        res.status(500).send("خطا هنگام دریافت این مقاله")
    }
    
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
        const NEW_ARTICLE = new articleObj({
            author: req.session.user._id,
            description: req.body.title,
            text: req.body.content
        });

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

// update article
let articleID;
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