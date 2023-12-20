const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");

global.CLIENT_ID = `${fs.readFileSync(`${process.env.HOME}/.corki/client_id`)}`.trim();
global.CLIENT_SECRET = `${fs.readFileSync(`${process.env.HOME}/.corki/client_secret`)}`.trim();

const app = express();

// support for cookies
app.use(cookieParser());

// catch errs
app.use((err, req, res, next) =>
    res.status(err.message == "NoCodeProvided" ? 400 : 500)
        .send({
            status: "ERROR",
            error: err.message,
        })
);
const querystring = require('querystring');
app.use((req, res, next) => {
	    if (req.path === "/") return next();
	    const bodyString = JSON.stringify(req.body) || '';
	    const qs = querystring.stringify(req.query);
	    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
	    console.log('corki:web', `${req.method} ${req.path}${qs ? '?' + qs : ''} body=${bodyString.length > 2 ? bodyString.length.toString() + " bytes" : "∅"} (${ip})`);
	    next();
});


app.use("/resources", express.static(path.join(__dirname, "resources")));
app.use('/', require("./pages/home"));          // /
app.use('/', require("./pages/login"));         // /login/*
app.use('/', require("./pages/user"));          // /user/*
app.use('/', require("./pages/guild_admin"));   // /admin/*
app.use('/', require("./pages/guild_mod"));     // /mod/*
app.use('/', require("./pages/guild_member"));  // /server/*

// use port 5050
const port = 5050;
app.listen(port, (req, res) => {
    console.info("portal running on port " + port);
});
