//require use ful module
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require("mongoose");
const apiRoute = require("./routes/apiRoute.js");
const path = require("path");

// view engine setup
app.set('view engine', 'ejs');

// connect mongodb to db with mongoose
mongoose.connect(
    "mongodb://localhost:27017/ArticleService",
    {
        useFindAndModify: false,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    console.log("connected to article db")
);

//for set session
// req.session = session
// initialize express-session to allow us track the logged-in user across sessions.
// app.use(session({
//     key: 'user_sid',
//     secret: 'somerandonstuffs',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         expires: 600000
//     }
// }));

// // check request for compar cookies on client and session on server
// app.use(function(req, res, next) {
// 	if (req.cookies.user_sid && !req.session.user) {
// 		res.clearCookie("user_sid");
// 	};
// 	next();
// });

//set publicFile static
app.use("/", express.static("public"));

//for use body parser
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json

//for use cookieParser
app.use(cookieParser());

app.use("/api", apiRoute);

app.listen(4000, function () {
    console.log("article server run on port: 4000");
});