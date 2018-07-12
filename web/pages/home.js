
const express = require("express");

const router = express.Router();

const bot = require("../middleman.js");


router.get('/', (req, res) => {
    global.portal_host = req.headers.host;
    if (!req.cookies.token) {
        res.redirect("/login");
        return;
    }

    res.send(`token = ${req.cookies.token}<br>
              id = ${req.cookies.userid}`);

});

module.exports = router;
