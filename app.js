//require useFul modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const apiRout = require("./routes/apiRout.js");
const path = require("path");
require("./tools/initialization.js");

// view engine setup
app.set('view engine', 'ejs');

//connect app to mongoDatabase
mongoose.connect(
    "mongodb://localhost:27017/WebBlog",
    {
        useFindAndModify: false,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

//set publicFile static
app.use("/", express.static("public"));

//for use body parser
app.use(bodyParser.urlencoded({'extended': 'true', limit: "50mb"})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json({limit: "50mb", "extended": "true"})); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json

//for use cookieParser
app.use(cookieParser());

//for set session
// req.session = session
// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 6000000
    }
}));

// check request for compar cookies on client and session on server
app.use(function(req, res, next) {
	if (req.cookies.user_sid && !req.session.user) {
		res.clearCookie("user_sid");
	};
	next();
});

//pass to api rout for divide req
app.use("/api", apiRout);

// get home page
app.get("/", function (req, res) {
    res.render( path.join(__dirname, "/views/pages/home.ejs"), {isLoggedIn: req.session.user} );
});

//set port for my app
app.listen(3000, function () {
    console.log("Server Started On Port: 3000");
})