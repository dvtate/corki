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
        res.redirect("/login/admin");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token, res);

    let page = new Page(null, userid);


    const guilds = bot.adminServers(userid);
    if (guilds.length == 0) {
        page.startFieldset("No Servers Detected")
            .add(`<p>To continue, you must be an administrator of a server where
                 <a href="https://corki.js.org">Corki Bot</a> is used.</p>
                 <button type="button" onclick="redirect('https://corki.js.org')">Add Corki to Server</button>
                 <button type="button" onclick="redirect('/')">Return to Portal Home</button>`);
        res.send(page.export());
        return;
    }
    page.addStyle(`
        div.guild-entry {
            border-radius: 8px;
            border: 1px solid grey;
            background-color: rgb(60, 60, 70);
            transition: background-color 0.5s;
            cursor: pointer;
            margin: 2px;
        }
        div.guild-entry:hover {
            background-color: rgb(50, 50, 60);
        }

        div.guild-icon-container {
            border-bottom-left-radius: 8px;
            border-top-left-radius: 8px;
            background-size: contain;
            height: 128px;
            width: 128px;

        }

        div.guild-icon-container img {
            width: 100%;
            padding: 0;
        }
    `);
    page.startFieldset("Select Server to Administrate")
        .add(`<p>The following is a list of servers you have administrator priviliges in.</p>`);

    guilds.forEach(g => {
        page.add(`
            <div class="guild-entry row" onclick="redirect('/admin/${g[1].id}')">
                <div class="guild-icon-container" style="background-image: url(${g[1].iconURL});"></div>
                <div>
                    <h3>${g[1].name}</h3><hr/>
                </div>
            </div>
        `)
    });

    page.endFieldset().add("<h5>Select a Server to Continue</h5>");





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
