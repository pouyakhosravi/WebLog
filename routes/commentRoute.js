const express = require("express");
const router = express.Router();
const path = require("path");
const commentObj = require("../models/commentObj.js");
const accessControl = require("../tools/accessControl.js");


// set comment
router.post("/", function (req, res) {
    if(!req.body.whoIs || !req.body.text)
    {
        return res.status(400).send("فیلد های خالی را پر کنید");
    }

    const NEW_COMMENT = new commentObj({
        whoIs: req.body.whoIs,
        text: req.body.text,
        article: req.body.articleID
    });

    if(req.session.user)
    {
        if(req.session.user.role === "admin")
        {
            NEW_COMMENT.letShow = true;
        }
    }

    NEW_COMMENT.save(function (err, comment) {
        if(err)
        {
            return res.status(500).send("خطا هنگام سیو کامنت");
        }
        else
        {
            if(req.session.user)
            {
                if(req.session.user.role !== "admin") return res.send("نظر شما در انتظار تایید میباشد");
            
                return res.send("نظر شما ثبت شد");
            }
            else
            {
                return res.send("نظر شما در انتظار تایید میباشد");
            }
        }
    })
});


// sent all comment to confirm
router.get("/", accessControl.checkAdmin, function (req, res) {
    commentObj.find({letShow: false}, function (err, comments) {
        if(err) return res.status(500).send("خطا هنگام دریافت کامنت های تایید نشده.");

        res.render( path.join(__dirname, "../views/pages/confirmPage.ejs"), {comments: comments, articles: "", messages: "", users: ""} )
    })
});


//submit comment
router.put("/submit", accessControl.checkAdmin, (req, res) => {
    let commentID = req.body.id;

    // ========= use of promise solution for this work ============

    let promiseSubmit = new Promise( (resolve, reject) => {

        commentObj.findByIdAndUpdate({_id: commentID}, {letShow: true}, (err, updateResult) => {
            if(err) return reject(err);

            resolve("تایید کامنت با موفقیت انجام شد.");
        });

    });

    // use of submit promise
    promiseSubmit.then((result) => {
        res.send(result);
    }).catch( (err) => {
        res.send(err);
    } )
});


// delete Comment
router.delete("/:commentID", accessControl.checkAdmin, async (req, res) => {
    try 
    {
        await commentObj.findByIdAndDelete(req.params.commentID);

        return res.send("این نظر با موفقیت حذف شد");
    } 
    catch (error) 
    {
        res.status(500).send("خطا هنگام حدف این نظرم");
    }
});

module.exports = router