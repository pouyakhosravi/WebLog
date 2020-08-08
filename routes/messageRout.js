const express = require("express");
const router = express.Router();
const path = require("path");
const messageObj = require("../models/messageObj.js");
const accessControl = require("../tools/accessControl.js");


// get all message
router.get("/allMessage", accessControl.checkAdmin, function (req, res) {
    messageObj.find({}, function (err, messages) {
        if(err) return res.status(500).send("خطا هنگام دیافت پیام هیا چک نشده.");

        res.render( path.join(__dirname, "../views/pages/confirmPage.ejs"), {articles: "", comments: "", messages: messages, users: ""} );
    })

});


// delete message
router.delete("/:messageID", accessControl.checkAdmin, function (req, res) {
    messageObj.findByIdAndDelete(req.params.messageID, (err, delResult) => {
        if(err) return res.status(500).send("خطا هنگام حدف پیام");

        return res.send("این پیام با موفقیت حذف شد");
    });
});


module.exports = router;