const express = require("express");


const bot = require("../middleman.js");
const Page = require("../page.js");

const mods = require("../../sam/mods");
const roles = require("../../sam/roles");


const router = express.Router();



// server select
router.get("/mod", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/mod");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token, res);

    let page = new Page("Server Management", userid);


    const guilds = bot.modServers(userid);
    if (guilds.length == 0) {
        page.startFieldset("No Servers Detected")
            .add(`<p>To continue, you must be an administrator/mod of a server where
                 <a href="https://corki.js.org">Corki Bot</a> is used. In addition,
                 if you are a mod, a server Administrator must grant you access to the
                 management page via the <a href="/admin">Admin Portal</a>.</p>
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
    page.startFieldset("Select Server to Manage")
        .add(`<p>The following is a list of servers you have moderator priviliges in.</p>`);

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


// feature presentation
router.get("/mod/:serverid([0-9]+)", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/mod");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token, res);


    const perms = mods.getModData(req.params.serverid, userid);
    const guild = global.client.guilds.get(req.params.serverid);

    // unauthorized
    if (!guild || (!perms.admin && !perms.mod)) {
        let page = new Page(null, userid);
        page.startFieldset("Access Denied")
            .add(`
                <p>In order to access this page you must be a designated mod in ${
                    guild ? guild.name : "a server where Corki Bot operates"
                }. </p>
                <button type="button" onclick="redirect('https://corki.js.org')">Add Corki to Server</button>
                <button type="button" onclick="redirect('/')">Return to Portal Home</button>
                <button type="button" onclick="redirect('/mod')">Return to Server Select</button>`)
            .endFieldset();

            res.send(page.export());
            return;
    }

    let page = new Page(`${guild.name} <span style="font-size: 70%;">Management</span>`, userid);

    /* Services

    League Stuff
        Mastery roles
        Leaderboard

    RSS feeds
    Roles
    welcome msg

    coming soon

    */

    // sar
    page.startFieldset("Self-Assignable Roles")
        .add(`<button type="button" onclick="redirect('/mod/${req.params.serverid}/resetroles')">Reset Self Assignable Roles</button>`)
        .add(`<p>The following is a list of roles you have designated as self-assignable. Roles will appear here even if the server doesn't have the given roles created so make sure you spelled and capitalized everything correctly</p>`)
        .addTable([ "Role", "Action" ],
            roles.getRoles(req.params.serverid).map(r =>
                [r, `<button type="button" onclick="redirect('/mod/${req.params.serverid}/rmrole/${encodeURIComponent(r)}')">Remove From List</button>`]), "Self-Assignable Roles")

        .addScript(`
            function addSAR() {
                const role = document.getElementById("add-sar").value;
                redirect("/mod/${req.params.serverid}/addrole/" + encodeURIComponent(role));
            }
        `)
        .add(`<br/>
            <input id="add-sar" type="text" /><button type="button" onclick="addSAR()" >Add Role</button>
            `)
        .endFieldset();


    res.send(page.export());

    // welcome msgs

}));

// delete given role
router.get("/mod/:serverid([0-9]+)/rmrole/:role", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/mod");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token, res);
    let perms = mods.getModData(req.params.serverid, userid);
    let guild = global.client.guilds.get(req.params.serverid);

    // unauthorized
    if (!guild || (!perms.admin && !perms.mod)) {
            res.redirect(`/mod/${req.params.serverid}`);
            return;
    }

    // remove all instances of given role from roles file
    const role = decodeURIComponent(req.params.role);
    roles.setRoles(req.params.serverid,
        roles.getRoles(req.params.serverid).filter(r => r != role));

    res.redirect(`/mod/${req.params.serverid}`);

}));

// delete given role
router.get("/mod/:serverid([0-9]+)/addrole/:role", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/mod");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token, res);
    let perms = mods.getModData(req.params.serverid, userid);
    let guild = global.client.guilds.get(req.params.serverid);

    // unauthorized
    if (!guild || (!perms.admin && !perms.mod)) {
            res.redirect(`/mod/${req.params.serverid}`);
            return;
    }

    const role = decodeURIComponent(req.params.role);
    roles.addRole(req.params.serverid, role);

    res.redirect(`/mod/${req.params.serverid}`);

}));


// delete given role
router.get("/mod/:serverid([0-9]+)/resetroles", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/mod");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token, res);
    let perms = mods.getModData(req.params.serverid, userid);
    let guild = global.client.guilds.get(req.params.serverid);

    // unauthorized
    if (!guild || (!perms.admin && !perms.mod)) {
            res.redirect(`/mod/${req.params.serverid}`);
            return;
    }

    roles.resetRoles(req.params.serverid);

    res.redirect(`/mod/${req.params.serverid}`);

}));

module.exports = router;
