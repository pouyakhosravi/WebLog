//require useFul modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const apiRout = require("./routes/apiRout.js");
require("./tools/initialization.js");

//for use cookieParser
app.use(cookieParser());

//check request for cookies
app.use(function(req, res, next) {
    
	if (req.cookies.user_sid && !req.session.user) {
		res.clearCookie("user_sid");
	};

	next();
});

//for set seasion
// req.session = session
// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

//for use body parser
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json

//connect app to mongoDatabase
mongoose.connect(
    "mongodb://localhost:27017/WebBlog",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
// handle mongoose collection.ensureIndex warn
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// view engine setup
app.set('view engine', 'ejs');

//set publicFile static
app.use("/", express.static("public"));

//pass to api rout for divide req
app.use("/", apiRout);

//set port for my app
app.listen(3000, function () {
    console.log("Server Started On Port: 3000");
})