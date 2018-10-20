const express = require("express");

const logCmd = require("../../logging");

const bot = require("../middleman.js");
const Page = require("../page.js");

const teemo = require("../../lol/teemo.js");
const mods = require("../../sam/mods");
const roles = require("../../sam/roles");
const welcome = require("../../sam/welcome");
const masteryRoles = require("../../lol/mastery_roles");
const prefix = require("../../sam/prefix.js");
const lol_lb = require("../../lol/lol_leaderboard");
const rss = require("../../rss/rss_stuff");


const router = express.Router();


/*

tree:
    /mod : showss list of servers user has mod in
        /mod/:serverid : moderation portal for given server
          - SAR:
            /mod/:serverid/addole/:role : adds given :role
            /mod/:serverid/rmrole/:role : removes given role
            /mod/:serverid/resetroles : clears all SAR

          - Welcome msgs:
            /mod/:serverid/addwelcome/:channelid/:msg : add a welcome mesg
            /mod/:serverid/rmwelcome/:welcomeobj : removes a welcome mesg
*/






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
            height: 128px; width: 128px;
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
        Leaderboard - make modular so this can be managed here...

    RSS feeds
    Dictionary
    */

    page.add(`
        <!-- league of legends champion names -->
        <datalist id="champs">
            <option value="${Object.keys(teemo.champIDs).join("\">\n<option value=\"")}">
        </datalist>

        <!-- text channels in current guild -->
        <datalist id="chans">
            <option value="${
                Array.from(global.client.guilds.get(req.params.serverid).channels)
                    .filter(c => c[1].type == "text").map(c => c[1].name)
                    .join("\">\n<option value=\"")
            }">
        </datalist>
    `);


    page.startFieldset("Command Prefixes")
        .add(`
            <p>In case another, more important bot also uses <kbd>-</kbd> to prefix its commands,
 Corki can respond to commands of a different prefix. In addition, Corki will always respond to
 commands starting with his mention (@Corki Bot#2838).`);


    const prefixTable = prefix.getGuildPrefixes(req.params.serverid).map(p =>
        [`<kbd>${p}</kbd>` ,  `<button type="button" onclick="redirect('/mod/${req.params.serverid}/rmprefix/${encodeURIComponent(p)}')">Remove</button>`]);
    page.addTable([ "Prefix", "Action" ], prefixTable, "Command Prefixes")
    if (prefixTable.length == 0)
        page.add("<center>Corki bot can only be used via direct mentions in this server</center>");

    page.addScript(`
        function addPrefix() {
            const prefix = document.getElementById("add-prefix").value;
            redirect("/mod/${req.params.serverid}/addprefix/" + encodeURIComponent(prefix));
        }
    `).add(`<br/>
        <input id="add-prefix" type="text" placeholder="command prefix" />
        <button type="button" onclick="addPrefix()">Add Prefix</button>
    `).endFieldset();


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
        page.add("<center><h4>None (yet)</h4></center>");

    page.addScript(`
            function addSAR() {
                const role = document.getElementById("add-sar").value;
                redirect("/mod/${req.params.serverid}/addrole/" + encodeURIComponent(role));
            }
        `)
        .add(`<br/>
            <input id="add-sar" type="text" placeholder="name of new role" />
            <button type="button" onclick="addSAR()" >Add Role</button>
            <button type="button" style="background-color: red;"
                onclick="redirect('/mod/${req.params.serverid}/resetroles')">
                    Reset Self Assignable Roles</button>`)
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
            `<button type="button" onclick="redirect('/mod/${req.params.serverid}/rmwelcome/${
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
            redirect("/mod/${req.params.serverid}/addwelcome/"
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
        # <input list="chans" id="welcome-channel" placeholder="channel-name" /> :
        <input type="text" id="welcome-msg-template" value="Welcome to {{server}}, {{mention}}!" />
        <button type="button" onclick="addNewMemberAnnouncement()">Add New Member Announcement Rule</button>
    `)
    page.endFieldset();



    page.startFieldset("LoL Champion Mastery Leaderboard").add(`
        <p>Corki can periodically send a leaderboard for the members of a server with the most mastery points on a given champion.</p>
    `);

    const lol_lb_table = lol_lb.getRules(req.params.serverid).map(r => {
        let chan = global.client.guilds.get(req.params.serverid).channels.find("name", r.chan.name)
                    || global.client.guilds.get(req.params.serverid).channels.get(r.chan.id);

        return [
            teemo.champNames[r.champ],
            '#' + chan.name,
            (r.cd.period / 86400000) + " days",
            `<button type="button" onclick="redirect('/mod/${req.params.serverid}/rmcmlb/${
                encodeURIComponent(JSON.stringify({ champ: r.champ, chan: r.chan.id, per: r.cd.period }))
            }')">Remove</button>`
        ];
    });

    page.addTable(["Champion", "Channel", "Period", "Actions"],
        lol_lb_table, "Leaderboards");
    if (lol_lb_table.length == 0)
        page.add("<center><h4>None (yet) </h4></center>");

    page.addScript(`
        function addCMLB() {
            //alert("Sorry, this feature hasn't been implement yet. for now please use \`-lol add-lb <champ> <period>\` in the desired channel");
            const champ = document.getElementById("cmlb-champ").value;
            const chan = document.getElementById("cmlb-chan").value;
            const per = document.getElementById("cmlb-period").value;
            const uri = encodeURIComponent(JSON.stringify(
                { champ : champ, chan: chan, per: per }));
            redirect("/mod/${req.params.serverid}/addcmlb/" + uri);
        }
        console.log(addCMLB);
    `).add(`<br/>
        Send a <input list="champs" id="cmlb-champ" placeholder="champ" />
        leaderboard to #<input list="chans" id="cmlb-chan" placeholder="channel-name" />
        every <input type="number" id="cmlb-period" placeholder="period of time" /> days.
        <button type="button" onclick="addCMLB()">Confirm</button>
    `).endFieldset();


    page.startFieldset("RSS Feeds").add(`
        <p>Corki can automatically forward RSS feeds to a channel.</p>
    `);


    const rss_table = rss.serverRules(req.params.serverid).map(r => {
        return [ '#' + global.client.channels.get(r.chan).name,
            r.url,
            `<button type="button" onclick="redirect('/mod/${req.params.serverid}/rmrss/${encodeURIComponent(JSON.stringify(r))}')">Remove</button>`
        ];
    });
    page.addTable([ "Channel", "URL", "Actions" ], rss_table, "Feed Subscriptions");
    if (rss_table.length == 0)
        page.add("<center><h4>None (yet)</h4></center>");

    page.add("This interface is not yet complete. Please use bot commands. Sorry");

    page.addScript(``)
        .add(`<br/>
            <!-- TODO: add new subscription interface -->
            `);


    /* TODO: add RSS subs
    * maybe rewrite RSS first
    */

/*
    page.startFieldset("League of Legends Roles [wip]");
    page.add(`<p>Corki can automatically assign roles to users based on how many mastery points they have on a specific champ</p>`);

    let lol_roles = masteryRoles.getRolesData(guild.id);
    for (let i = 0; i < lol_roles.length; i++) {
        page.startFieldset(`${teemo.champNames[lol_roles[i].champ]} Mastery roles`);
        page.add("Announcements: #" + lol_roles[i].announce);
        let rData = lol_roles[i].pts_roles.map(r => {
            return [ r.role, r.required, r.announce,
                `<button type="button" onclick="redirect('/mod/${guild.id}/rmmasteryrole/${i}/${encodeURIComponent(r.role)}')">remove</button>`];
        });
        page.addTable(["Role", "Minimum points", "Announce", "Actions"], rData, "Roles");

        page.startFieldset("Add New Role")
        page.add(`
            New Role: <input type="text" id="lol-mrole-${i}-name" ><br/>
            Points: <input type="number" id="lol-mrole-${i}-pts" ><br/>
            <div class="input-group">
                <input type="checkbox" id="lol-mrole-${i}-announce" >
                <label for="lol-mrole-${i}-announce" >announce in #${lol_roles[i].announce}</label>
            </div><br/>
            <button type="button" onclick="">Add Role</button>
            `)
            .addScript(`
                function addRole${i}() {

                    const name = document.getElementById("lol-mrole-${i}-name").value;
                    const minPts = JSON.parse(document.getElementById("lol-mrole-${i}-pts").value);
                    const announce = document.getElementById("lol-mrole-${i}-announce").checked;

                    if (!name || !minPts || !announce)
                        return;

                    redirect("/mod/${guild.id}/addMasteryRole/${i}/"
                        + encodeURIComponent(name) + '/' + minPts + '/' + announce);

                }
            `).endFieldset().endFieldset();

    }

    page.addScript(`
        function addRoleSet() {
            const champ = document.getElementById("new-mroleset-champ").value;
            const chan = document.getElementById("new-mroleset-chan").value;

            if (!champ || !chan)
                return;

            redirect("/mod/${guild.id}/addMasteryRoleset/"
                + encodeURIComponent(champ) + '/'
                + encodeURIComponent(chan));
        }
    `)
    page.startFieldset("Add New Roleset")
        .add(`
        Roleset Champion: <input type="text" id="new-mroleset-champ" placeholder="corki" /><br/>
        Roleset Announcement Channel: #<input type="text" id="new-mroleset-chan" placeholder="general"><br/>
        <button onclick="addRoleSet()">Add Another Champion Roleset</button>`)
        .endFieldset()
        .endFieldset();

    page.startFieldset("More Coming soon").add(`Corki has so many more features
         which are already implemented but not currently accessable here. Come back later for more :D`).endFieldset();
*/



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


    if (guild && (perms.admin || perms.mod)) {
        logCmd(null, `web@${global.client.users.get(userid).username} removed a SAR`);

        // remove all instances of given role from roles file
        const role = decodeURIComponent(req.params.role);
        roles.setRoles(req.params.serverid,
            roles.getRoles(req.params.serverid).filter(r => r != role));
    }
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

    if (guild && (perms.admin || perms.mod)) {
        logCmd(null, `web@${global.client.users.get(userid).username} added a SAR`);
        const role = decodeURIComponent(req.params.role);

        if (!guild.roles.find("name", role)) {
            return res.send(bot.genErrorPage(userid, "Role Not Found", `
It appears that ${guild.name} doesn't have a role called ${role} you should make
sure you've added it in discord settings. <br/>
<button type="button" onclick="redirect('/mod/${req.params.serverid}')">Continue</button>
            `).export());
        }
        roles.addRole(req.params.serverid, role);
    }
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

    if (guild && (perms.admin || perms.mod)) {
        logCmd(null, `web@${global.client.users.get(userid).username} cleared all SARs`);
        roles.resetRoles(req.params.serverid);
    }
    res.redirect(`/mod/${req.params.serverid}`);

}));


// delete given role
router.get("/mod/:serverid([0-9]+)/addwelcome/:chan/:msg", bot.catchAsync(async (req, res) => {
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

    if (guild && (perms.admin || perms.mod)) {
        logCmd(null, `web@${global.client.users.get(userid).username} added a welcome msg`);

        const channame = decodeURIComponent(req.params.chan)
        const chan = guild.channels.find("name", channame);

        // TODO: also check if chan is a category and doesn't allow sending
        if (!chan) {
            let page = new Page("Invalid Channel", userid);
            page.startFieldset("Invalid Channel")
                .add(`
                    <p>${guild.name} doesn't appear to have a channel #${channame}.
                     Check and make sure you typed the name correctly</p>
                     <button type="button" onclick="redirect('/mod/${req.params.serverid}')">Go back</button>
                `).endFieldset();

            res.send(page.export());
            return;
        }
        if (!req.params.chan || !req.params.msg) {
            res.redirect("/mod/" + req.params.serverid);
            return;
        }

        welcome.pruneRules(guild.id);
        let rules = welcome.getAnnouncementData(guild.id);
        rules.push({
            id: chan.id,
            msg: decodeURIComponent(req.params.msg)
        });
        welcome.setAnnouncementData(guild.id, rules);

    }
    res.redirect(`/mod/${req.params.serverid}`);

}));


// delete given rule
router.get("/mod/:serverid([0-9]+)/rmwelcome/:rule", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/mod");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token, res);
    let perms = mods.getModData(req.params.serverid, userid);
    let guild = global.client.guilds.get(req.params.serverid);

    if (guild && (perms.admin || perms.mod)) {
        logCmd(null, `web@${global.client.users.get(userid).username} removed a welcome msg`);

        welcome.pruneRules(guild.id);
        let rules = welcome.getAnnouncementData(guild.id);
        rules = rules.filter(r => {
            const rule = JSON.parse(decodeURIComponent(req.params.rule));
            return rule.id != r.id || rule.msg != r.msg;
        });
        welcome.setAnnouncementData(guild.id, rules);
    }
    res.redirect(`/mod/${req.params.serverid}`);
}));

router.get("/mod/:serverid([0-9]+)/addprefix/:prefix", bot.catchAsync( async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/mod");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token, res);
    let perms = mods.getModData(req.params.serverid, userid);
    let guild = global.client.guilds.get(req.params.serverid);

    if (guild && (perms.admin || perms.mod)) {
        logCmd(null, `web@${global.client.users.get(userid).username} added a cmd prefx`);

        let prefixes = prefix.getGuildPrefixes(req.params.serverid);
        prefixes.push(prefix.escapeRegExp(decodeURIComponent(req.params.prefix)).trim());
        prefix.setGuildPrefixes(req.params.serverid, prefixes);

    }
    res.redirect(`/mod/${req.params.serverid}`);
}));

router.get("/mod/:serverid([0-9]+)/rmprefix/:prefix", bot.catchAsync( async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/mod");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token, res);
    let perms = mods.getModData(req.params.serverid, userid);
    let guild = global.client.guilds.get(req.params.serverid);

    if (guild && (perms.admin || perms.mod)) {
        logCmd(null, `web@${global.client.users.get(userid).username} removed a prefix`);

        let prefixes = prefix.getGuildPrefixes(req.params.serverid);
        prefix.setGuildPrefixes(req.params.serverid, prefixes.filter(p =>
            p != prefix.escapeRegExp(decodeURIComponent(req.params.prefix)).trim()
            && p != decodeURIComponent(req.params.prefix).trim()
        ));
    }
    res.redirect(`/mod/${req.params.serverid}`);
}));

router.get("/mod/:serverid([0-9]+)/rmcmlb/:lb", bot.catchAsync( async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/mod");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token, res);
    let perms = mods.getModData(req.params.serverid, userid);
    let guild = global.client.guilds.get(req.params.serverid);

    if (guild && (perms.admin || perms.mod)) {
        logCmd(null, `web@${global.client.users.get(userid).username} removed a cm lb`);

        let lb = JSON.parse(decodeURIComponent(req.params.lb)); // {champ, chan, per}
        let lb_rules = lol_lb.getRules(req.params.serverid);


        `<button type="button" onclick="redirect('/mod/${req.params.serverid}/rmcmlb/${
            encodeURIComponent(JSON.stringify({ champ: r.champ, chan: r.chan.id, per: r.cd.period }))
        }')">Remove</button>`

        lol_lb.setRules(req.params.serverid, lb_rules.filter(r =>
            r.champ != lb.champ || r.chan.id != lb.chan || r.cd.period != lb.per));
    }
    res.redirect(`/mod/${req.params.serverid}`);
}));


router.get("/mod/:serverid([0-9]+)/addcmlb/:lb", bot.catchAsync( async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/mod");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token, res);
    let perms = mods.getModData(req.params.serverid, userid);
    let guild = global.client.guilds.get(req.params.serverid);

    if (guild && (perms.admin || perms.mod)) {
        logCmd(null, `web@${global.client.users.get(userid).username} added a cm lb`);

        let lb = JSON.parse(decodeURIComponent(req.params.lb)); // {champ, chan, per}
        let chan = guild.channels.find("name", lb.chan);
        if (!chan)
            return res.send(bot.genErrorPage(userid, "Channel not found", `
The channel ${lb.chan} wasn't found in ${guild.name} the suggested options should
include all available channels. <br/>
<button type="button" onclick="redirect('/mod/${req.params.serverid}')">Continue</button>
            `).export());

        let champ = teemo.champIDs[lb.champ];
        if (!champ)
            return res.send(bot.genErrorPage(userid, "Invalid champion", `
The champion ${lb.champ} isn't in our database yet. if you believe this is a mistake
or if the champion you entered has been released recently please submit a -bug report
and you should be notified when the champion is added to the system.
<button type="button" onclick="redirect('/mod/${req.params.serverid}')">Continue</button>
            `).export());

        // if they enter period of zero then we post twice a day...
        const period = (Number(lb.per) ? lb.per : 0.5) * 86400000; // days -> milliseconds

        let lb_rules = lol_lb.getRules(req.params.serverid);

        // see /lol/lol_leaderboard.js for documentation on rules & stuff
        // add new rule to list of rules
        lb_rules.push({
            champ: champ,
            chan: { name: chan.name, id: chan.id },
            cd: { ts: 0, period: period },
            prev: []
        });

        lol_lb.setRules(req.params.serverid, lb_rules);


    }
    res.redirect(`/mod/${req.params.serverid}`);
}));




module.exports = router;
