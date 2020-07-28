const express = require("express");
const router = express.Router();
const path = require("path");
const articleObj = require("../models/articleObj.js");

// get all articles promise tori
// router.get("/allArticle", function (req, res) {

//     articleObj.find().then(function (articlesData) {
//         return res.json(articlesData);
//     }).catch(function (err) {
//         return res.status(500).send("خطا هنگام دریافت لیست مقاله ها");
//     });

// });

// get crate page
router.get("/newArticle", function (req, res) {
    res.render( path.join(__dirname, "../views/pages/newArticle.ejs") );
});

//create article
router.post("")

module.exports = router;