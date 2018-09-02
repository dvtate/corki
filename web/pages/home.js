
const express = require("express");

const router = express.Router();

const bot = require("../middleman.js");
const Page = require("../page.js");

router.get('/', bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/");
        return;
    }


    const userid = await bot.getUserID(req.cookies.token, res);

    let page = new Page(null, userid);
    page.startFieldset(`Welcome ${global.client.users.get(userid).username}!`)
        .addRaw(`
                <h2>What brings you here?</h2>
                <button type="button" onclick="redirect('/user')">User Settings</button>
                <button type="button" onclick="redirect('/admin')">Server Administration</button>
                <button type="button" onclick="redirect('/mod')">Server Management</button>
                <button type="button" onclick="redirect('/server')">Server Preferences</button>
        `)
        .addImage("/resources/discord-logowhite.png", "corki discord logo")
        .endFieldset()

    res.send(page.export());

}));

module.exports = router;
