
const express = require("express");

const router = express.Router();


const bot = require("../middleman.js");
const Page = require("../page.js");


const lol = require("../../lol/lol_stuff");
const teemo = require("../../lol/teemo");

router.get("/user", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/user");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token);

    let page = new Page("User Settings", userid, '/');
    page.startFieldset(`League of Legends Accounts`)
        .addRaw(`
            <button type="button">Add new account</button>
            <button type="button">Import from reddit</button>
            <button type="button">Reset Accounts</button>
        `);

    let data = lol.getUserData(userid);

    let table = [];

    for (let i = 0; i < data.accounts.length; i++) {
        let entry = [];
        entry.push(teemo.serverNames[data.accounts[i].server].toUpperCase());
        entry.push(data.accounts[i].name);
        entry.push(`
            <button type="button" onclick="redirect('/user/lol/rm/${data.accounts[i].id}')">Delete</button>
            ${ data.main == i ? "" :
            `<button type="button" onclick="redirect('/user/lol/main/${data.accounts[i].id}')">Main</button>`}`)
        table.push(entry);
    }

    data.accounts.forEach(a => {
        let entry = [];
        entry.push(a.server);
        entry.push(a.name);
        entry.push(`
            <button type="button" onclick="redirect('/user/lol/rm/${a.id}')">Delete</button>
            <button type="button" onclick="redirect('/user/lol/main/${a.id}')">Main</button>
            `)
    });


    page.addTable(["Region", "Name", "Actions"], table, "Linked Accounts")
        .endFieldset()
        .add(`<h2>This page isn't done yet :/</h2>`)

    res.send(page.export());
}));

router.get("/user/lol/reset", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/user");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token);
    if (!userid) {
        res.redirect("/login/user");
        return;
    }

    lol.removeDir(userid);
    res.redirect("/user");


}));

module.exports = router;
