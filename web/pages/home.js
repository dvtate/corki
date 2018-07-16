
const express = require("express");

const router = express.Router();

const bot = require("../middleman.js");
const Page = require("../page.js");

router.get('/', (req, res) => {
    global.portal_host = req.headers.host;
    if (!req.cookies.token) {
        res.redirect("/login");
        return;
    }

    let homepage = new Page(null, req.cookies.userid, '/');
    homepage.startFieldset(`Welcome ${global.client.users.get(req.cookies.userid).username}!`)
            .addRaw(`<h1>your API token is ${req.cookies.token}.</h1><hr/>more coming soon`)
            .endFieldset();

    res.send(homepage.export());



});

module.exports = router;
