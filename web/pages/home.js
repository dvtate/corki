
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

    // Make sure user is cached
    const user = await global.client.users.fetch(userid);

    let page = new Page(null, userid);
    page.startFieldset(`Welcome ${user.username}!`)
        .addRaw(`
                <h2>What brings you here?</h2>
                <button type="button" onclick="redirect('/user')">User Settings</button>
                <button type="button" onclick="redirect('/admin')">Server Administration</button>
                <button type="button" onclick="redirect('/mod')">Server Management</button>
                <!--<button type="button" onclick="redirect('/member')">Server Preferences</button>-->
        `)
        .addImage("/resources/discord-logowhite.png", "corki discord logo")
        .endFieldset()

    res.send(page.export());
}));

module.exports = router;