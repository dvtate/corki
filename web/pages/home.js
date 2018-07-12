
const express = require("express");

const router = express.Router();

const bot = require("../middleman.js");

router.get('/', (req, res) => {
    if (!req.cookies.token)
        res.redirect("/login");

    res.send(`token = ${req.cookies.token}<br>
              id = ${req.cookies.userid}`);
});

module.exports = router;
