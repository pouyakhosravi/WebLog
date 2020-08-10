//require useFul modules
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const apiRout = require("./routes/apiRout.js");
const path = require("path");
const counterObj = require("./models/counterObj.js");
const articleObj = require("./models/articleObj.js");
const userObj = require("./models/userObj.js");
require("./tools/initialization.js");

// create socketIo server in backend side
const socketIo = require("socket.io");
const { allowedNodeEnvironmentFlags } = require("process");
const serverSocket = socketIo(server);

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

// check request for compare cookies on client and session on server
app.use(function(req, res, next) {
    if (req.cookies.user_sid && !req.session.user)
    {
		res.clearCookie("user_sid");
	};
	next();
});

//pass to api rout for divide req
app.use("/api", apiRout);

// get home page
app.get("/", async function (req, res) {

    let visitCounter = await counterObj.findOneAndUpdate({}, {$inc: { visitCount: 1 }});
    let articlesCount = await articleObj.countDocuments({letShow: true});
    let usersCount = await userObj.countDocuments();

    res.render( path.join(__dirname, "/views/pages/home.ejs"), {isLoggedIn: req.session.user, userCount: usersCount, articleCount: articlesCount, visitCount: visitCounter.visitCount} );
});

// socket io req and res
serverSocket.on("connection", (socket) => {

    let allUserOnline;
    // for log in user
    socket.on("login", (name) => {
        socket.myName = name.name;

        let all = serverSocket.sockets.clients().connected;
        all = Object.values(all);
        allUserOnline = all.map(s => s.myName);

        socket.emit("successLogin", (name.name + " شما وارد چت روم شدید"));// send for same user success result
        socket.broadcast.emit('newUser', (name.name + " وارد چت روم شد"));//send to all user that new user logged in
        serverSocket.emit("addToOnlineList", allUserOnline);        
    });

    // for logOut user
    socket.on("logOut", (name) => {
        socket.disconnect();

        let all = serverSocket.sockets.clients().connected;
        all = Object.values(all);
        allUserOnline = all.map(s => s.myName);

        socket.emit("successLogOut", (name.name + " شما از چت روم خارج شدید"));// send for same user success result
        socket.broadcast.emit('oldUser', (name.name + " از چت  روم خارج شد."));//send to all user that new user logged in
        serverSocket.emit("removeFromOnlineList", allUserOnline);

    });

    //for new message
    socket.on("message", (msgData) => {
        socket.broadcast.emit("newMessage", msgData);
    });

    // for close
    socket.on("disconnect", () => {
        if(socket.id)
        {
            console.log(socket.id, "disconnected");
        }
    });
    
});


//set port for my app
server.listen(3000, function () {
    console.log("Server Started On Port: 3000");
});