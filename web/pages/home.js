
const express = require("express");

const router = express.Router();

const bot = require("../middleman.js");
const Page = require("../page.js");

router.get('/', (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/");
        return;
    }


    let homepage = new Page(null, req.cookies.userid, '/');
    homepage
            .startFieldset(`Welcome ${global.client.users.get(req.cookies.userid).username}!`)
            .addRaw(`
                    <h2>What brings you here?</h2>
                    <button type="button" onclick="redirect('/user')">User Settings</button>
                    <button type="button" onclick="redirect('/mod')">Server Moderation Panel</button>
                    <button type="button" onclick="redirect('/admin')">Server Admin Panel</button>
            `)
            .addImage("/resources/discord-logowhite.png", "corki discord logo")
            .endFieldset()
            .addRaw(`<h4>token: ${req.cookies.token}</h4>`);

    res.send(homepage.export());

});

module.exports = router;
