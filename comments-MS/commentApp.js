const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const apiRoute = require("./routes/apiRoute.js")

// view engine setup
app.set('view engine', 'ejs');

// connect mongodb to db with mongoose
mongoose.connect(
    "mongodb://localhost:27017/CommentsService",
    {
        useFindAndModify: false,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    console.log("connected to comments db")
);

//set publicFile static
app.use("/", express.static("public"));

//for use body parser
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json

//for use cookieParser
app.use(cookieParser());

app.use("/api", apiRoute);


app.listen(5000, function () {
    console.log("comment server run on port: 5000");
});