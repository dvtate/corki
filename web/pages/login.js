
const express = require("express");
const request = require("request");
const bot = require("../middleman.js");
const btoa = require("btoa");

const router = express.Router();



const redirect = encodeURIComponent('http://localhost:5050/callback');


// async/await error catcher
const catchAsync = fn => (
    (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch) {
            routePromise.catch(err => next(err));
        }
    }
);


router.get("/login", (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${global.CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

router.get("/callback", catchAsync(async (req, res) => {
    if (!req.query.code)
        throw new Error("NoCodeProvided");

    request.post({
        headers: {"Content-Type" : "application/x-www-form-urlencoded" },
        url: "https://discordapp.com/api/oauth2/token",
        json: true,
        form: {
            "grant_type" : "client_credentials",
            "code" : req.query.code,
            "client_id" : global.CLIENT_ID,
            "client_secret" : global.CLIENT_SECRET,
            "redirect_uri" : "https://localhost:5050/callback"
        }
    }, async (error, response, body) => {
        if (error)
            throw error;


        let id = await bot.getUserID(body.access_token);
        console.log(id);
        res .cookie("token", body.access_token, { maxAge: body.expires_in })
            .cookie("userid", id, { maxAge: body.expires_in })
            .redirect('/');
    });
}));

module.exports = router;
