const express = require("express");
const router = express.Router();
const path = require("path");

// get home page
router.get("/", function (req, res) {
    res.render( path.join(__dirname, "../views/pages/home.ejs") );
});

//get singUp page
router.get("/api/singUp", function (req, res) {
    res.render( path.join(__dirname, "../views/pages/singUp.ejs") );
})

module.exports = router;