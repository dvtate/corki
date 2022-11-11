const express = require("express");

const btoa = require("btoa");
const FormData = require("form-data");
const bot = require("../middleman.js");

const router = express.Router();

router.get("/login/:source", (req, res) => {
    const redirect_uri = encodeURIComponent(`http://${req.headers.host}/callback`);
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${global.CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect_uri}&state=${req.params.source}`);
});
router.get("/login/", (req, res) => {
    const redirect_uri = encodeURIComponent(`http://${req.headers.host}/callback`);
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${global.CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect_uri}`);
});

router.get("/callback", bot.catchAsync(async (req, res) => {
    const redirect_uri = `http://${req.headers.host}/callback`;

    if (!req.query.code)
        throw new Error("NoCodeProvided");

    const code = req.query.code;
    const source = req.query.state || '/';
    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

    const data = {
            client_id: global.CLIENT_ID,
            client_secret: global.CLIENT_SECRET,
            grant_type: "authorization_code",
            redirect_uri,
            code,
            scope: "identify"
    };
    const response = await fetch("https://discordapp.com/api/v6/oauth2/token?grant_type=authorization_code", {
        method: 'POST',
        body: new URLSearchParams(data),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
    	}
    });
    const json = await response.json();

    let id = await bot.getUserID(json.access_token, res);
    if (!id) {
        return;
    }

    res .cookie("token", json.access_token, { maxAge: json.expires_in })
        .redirect(decodeURIComponent(source));

}));


const Page = require("../page");

router.get("/unknown", bot.catchAsync(async (req, res) => {

    let page = new Page();
    page.startFieldset("Unknown User :/")
        .add(`<p>In order for you to access the Corki Bot web portal you have to
         use Corki Bot in a Discord server. You should add Corki bot to one of the servers
         you own/moderate.</p>
         <button type="button" onclick="redirect('https://corki.js.org/invite')">Add to Server</button>
         <button type="button" onclick="redirect('/login')">Try Again</button>
         <button type="button" onclick="redirect('https://corki.js.org')">Visit Corki Homepage</button>
         `)
         .endFieldset();

    res.send(page.export());

}));

module.exports = router;
