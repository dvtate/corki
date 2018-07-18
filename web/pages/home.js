
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
            .addRaw(`
                    <h2>What brings you here?</h2>
                    <a href="/user"><button>User Settings</button></a>
                    <a href="/mod"><button>Server Moderation Panel</button></a>
                    <a href="/admin"><button>Server Admin Panel</button></a>`)
            .endFieldset()
            .addRaw(`<h4>token: ${req.cookies.token}`);

    res.send(homepage.export());

});

module.exports = router;
