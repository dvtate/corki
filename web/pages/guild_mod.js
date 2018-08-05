const express = require("express");


const bot = require("../middleman.js");
const Page = require("../page.js");


const router = express.Router();

/* Services

League Stuff
    Mastery roles
    Leaderboard

RSS feeds
Roles

*/





router.get("/mod", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/mod");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token, res);

    let page = new Page(null, userid);


    const guilds = bot.modServers(userid);
    if (guilds.length == 0) {
        page.startFieldset("No Servers Detected")
            .add(`<p>To continue, you must be an administrator/mod of a server where
                 <a href="https://corki.js.org">Corki Bot</a> is used. In addition,
                 if you are a mod, a server Administrator must grant you access to the
                 moderation page via the <a href="/admin">Admin Portal</a>.</p>
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
            <div class="guild-entry row" onclick="redirect('/mod/${g[1].id}')">
                <div class="guild-icon-container" style="background-image: url(${g[1].iconURL});"></div>
                <div>
                    <h3>${g[1].name}</h3><hr/>
                </div>
            </div>
        `)
    });

    page.endFieldset().add("<h5>Select a Server to Continue</h5>");


    // present a list of mutual servers they have admin in




    res.send(page.export());


}));

module.exports = router;
