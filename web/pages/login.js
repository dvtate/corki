
const express = require("express");

const fetch = require("node-fetch");

const bot = require("../middleman.js");
const btoa = require("btoa");

const router = express.Router();


router.get("/login/:source", (req, res) => {
    const redirect = encodeURIComponent(`http://${req.headers.host}/callback`);
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${global.CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}&state=${req.params.source}`);
});

router.get("/login/", (req, res) => {
    const redirect = encodeURIComponent(`http://${req.headers.host}/callback`);
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${global.CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

router.get("/callback", bot.catchAsync(async (req, res) => {
    const redirect = encodeURIComponent(`http://${req.headers.host}/callback`);

    if (!req.query.code)
        throw new Error("NoCodeProvided");

    const code = req.query.code;
    const source = req.query.state || '/';
    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${creds}`,
        }
    });
    const json = await response.json();

    res .cookie("token", json.access_token, { maxAge: json.expires_in })
        .redirect(source);

}));

module.exports = router;
