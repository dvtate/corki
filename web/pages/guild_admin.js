const express = require("express");


const bot = require("../middleman.js");
const Page = require("../page.js");


const router = express.Router();



/* mods.json

[
    {
        id: userid,
        permissions: true, // full admin
    },
    {
        id: 5,
        permissions: {
            "Manage Server": {
                "Manage Users" : true,
                "Manage Roles" : true,
                "Manage Channels": true
            },
            "Manage Bot": {
                "Manage Automated Messages": true,
                "Manage Server Metadata": true,
                "Manage Server Metadata": true
            }
        }
    }
]


*/




router.get("/admin", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/");
        return;
    }


    const userid = await bot.getUserID(req.cookies.token, res);

    let page = new Page(null, userid);


    // present a list of mutual servers they have admin in




    res.send(page.export());


}));


router.get("/admin/:serverid([0-9]+)", bot.catchAsync(async (req, res) => {

    if (!req.cookies.token) {
        res.redirect("/login/");
        return;
    }


    const userid = await bot.getUserID(req.cookies.token, res);

    let page = new Page(null, userid);

    // verify they are admin in given server
    // get mods.JSON
    // searchable droopdown box (user select) (mod selsct)
    // javascript
    // checkboxes for permissions tree
    // submit button idek

    // recombine data into an object then use encodeURIComponent() to send it to
    //    /admin/server/apply/json


    res.send(page.export());


}));

router.get("/admin/:serverid([0-9]+)/apply/:modsjson", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/");
        return;
    }


    const userid = await bot.getUserID(req.cookies.token, res);

    let page = new Page(null, userid);


    // actually apply changes requested in /admin/serverid


    res.send(page.export());


}));



module.exports = router;
