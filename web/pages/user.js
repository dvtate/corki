
const express = require("express");

const router = express.Router();


const bot = require("../middleman.js");
const Page = require("../page.js");



router.get("/user", (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/user");
        return;
    }
    let page = new Page(null, req.cookies.userid, '/');
    page
        .startFieldset(`League of Legends Accounts`)
        .addRaw(`
            <button type="button">Add new account</button>
            <button type="button">Import from reddit</button>
            <button type="button">Reset Accounts</button>
        `)
        .addTable(["Region", "Name", "Actions"], [
            [ "NA", "ridderhoff", "<button type=\"button\">Delete</button>"],
            [ "NA", "ridderhoff", "<button type=\"button\">Delete</button>"],
            [ "NA", "ridderhoff", "<button type=\"button\">Delete</button>"],
        ], "Linked Accounts")
        .endFieldset()
        .add(`<h2>This page isn't done yet</h2>`)

    res.send(page.export());
})

module.exports = router;
