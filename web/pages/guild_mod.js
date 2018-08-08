const express = require("express");


const bot = require("../middleman.js");
const Page = require("../page.js");

const mods = require("../../sam/mods");
const roles = require("../../sam/roles");
const welcome = require("../../sam/welcome");

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

    /* Services to add

    League Stuff
        Mastery roles
        Leaderboard

    RSS feeds
    welcome msg

    */

    // self assignable roles
    page.startFieldset("Self-Assignable Roles")
        .add(`
            <p>The following is a list of roles you have designated as self-assignable.
 Roles will appear here even if the server doesn't have the given roles created so
 make sure you spelled and capitalized everything correctly</p>`);

    const roleTableValues = roles.getRoles(req.params.serverid).map(r =>
        [r, `<button type="button" onclick="redirect('/mod/${req.params.serverid}/rmrole/${encodeURIComponent(r)}')">Remove From List</button>`])
    page.addTable([ "Role", "Action" ], roleTableValues, "Self-Assignable Roles");

    if (roleTableValues.length == 0)
        page.add("<center><h4>There are no self-assignable roles</h4></center>");

    page.addScript(`
            function addSAR() {
                const role = document.getElementById("add-sar").value;
                redirect("/mod/${req.params.serverid}/addrole/" + encodeURIComponent(role));
            }
        `)
        .add(`<br/>
            <input id="add-sar" type="text" placeholder="name of new role" />
            <button type="button" onclick="addSAR()" >Add Role</button>
            <br/>
            `)
        .add(`<button type="button" style="background-color: red;" onclick="redirect('/mod/${req.params.serverid}/resetroles')">Reset Self Assignable Roles</button>`)
        .endFieldset();


    // welcome new members
    page.startFieldset("Welcome Messages")
        .add(`
            <p>Corki can automatically welcome new members to your server and
 even provide you with useful information and/or point them into the right direction.
 The following rules have been defined.</p>`);

    welcome.pruneRules(guild.id);
    const announcementTableValues = welcome.getAnnouncementData(guild.id).map(rule => {
        return [
            '#' + global.client.channels.get(rule.id).name,
            rule.msg,
            `<button type="button" onclick="redirect('/mod/${req.params.serverid}/rmrule/${
                encodeURIComponent(JSON.stringify(rule))}')">Remove</button>`
        ]
    });
    page.addTable(["Channel", "Message Template", "Actions"], announcementTableValues,
        "New Member Announcements");
    if (announcementTableValues.length == 0)
        page.add("<center><h4>New Members Will Not be Announced</h4></center>");

    page.addScript(`
        function addNewMemberAnnouncement() {
            const chan = document.getElementById("welcome-channel").value;
            const msg = document.getElementById("welcome-msg-template").value;
            if (!chan || !msg)
                return;
            redirect("/mod/${req.params.serverid}/addWelcome/"
                + encodeURIComponent(chan) + '/'
                + encodeURIComponent(msg)
            );
        }
    `)
    .add(`
        <h4>Message Formatting</h4>
        <p>The following strings have special meanings.</p>
        <ul>
            <li><kbd>{{mention}}</kbd>Mentions the new member</li>
            <li><kbd>{{server}}</kbd>Says the server's name</li>
            <li><kbd>{{memberCount}}</kbd>Number of members the server has</li>
            <li>To add any other formatted content, send the bot <kbd>-deformat &lt;formatted text></kbd>And copy-paste in the box</li>
        </ul>
        Alternatively you can send this same content using the command <kbd>-announce-new-members &lt;message template></kbd>.
        <br/><br/>
        #<input type="text" id="welcome-channel" placeholder="new-members" /> :
        <input type="text" id="welcome-msg-template" value="Welcome to {{server}}, {{mention}}!" />
        `)
    page.endFieldset();
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
