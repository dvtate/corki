const express = require("express");


const bot = require("../middleman.js");
const Page = require("../page.js");

const mods = require("../../sam/mods");
const sam = require("../../sam/sam");

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
        div.guild-entry:hover { background-color: rgb(50, 50, 60); }

        div.guild-icon-container {
            border-bottom-left-radius: 8px;
            border-top-left-radius: 8px;
            background-size: contain;
            height: 128px; width: 128px;
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
        `);
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


    let perms = mods.getModData(req.params.serverid, userid);
    let guild = global.client.guilds.get(req.params.serverid);

    // unauthorized
    if (!guild || !perms.admin) {
        page.startFieldset("Access Denied")
            .add(`
                <p>In order to access this page you must be a designated admin in ${
                    guild ? guild.name : "a server where Corki Bot operates"
                }. </p>
                <button type="button" onclick="redirect('https://corki.js.org')">Add Corki to Server</button>
                <button type="button" onclick="redirect('/')">Return to Portal Home</button>
                <button type="button" onclick="redirect('/admin')">Return to Server Select</button>`)
            .endFieldset();

            res.send(page.export());
            return;
    }


    // user-select
    page.startFieldset("Select Server Member")
        .add(`
                <input list="guild-members" id="member-select" onchange="chkin()" />
                <datalist id="guild-members">
                    <option value="${
                        Array.from(guild.members).map(m =>
                            `@${m[1].user.username}#${m[1].user.discriminator}`
                        ).join("\">\n<option value=\"")
                    }">
                </datalist>`
            , "Select Server Member", "user-select")

        .endFieldset();

    // edit permissions
    page.startFieldset("Permissions Settings")
        .add(`<div id="permissions-form">Select a member to edit their permissions. When you have finished use the apply button.</div>`)
        .endFieldset();


    page.add(`<h5 id="commit-summary"></h5>`);

    // submit/reset
    page.add(`
        <span id="submit-box" class="row">
            <div class="col-md-6">
                <button type="button" onclick="redirect('/admin/${req.params.serverid}')">Reset</button>
            </div><div class="col-md-6">
                <button type="button" onclick="submit()">Apply</button>
            </div>
        </span>`);


    page.addScript(`

        // list of guild members
        const members = ${
            JSON.stringify(
                Array.from(guild.members).map(m => {
                    return {
                        id : m[1].user.id,
                        name : `@${m[1].user.username}#${m[1].user.discriminator}`
                    };
                })
            )
        };

        // from mods.getMods
        let modData = ${JSON.stringify(mods.getMods(guild.id))};

        function getId(name) {
            const mem = members.find(m => m.name == name);
            if (mem) return mem.id;
        }

        function showPermissions(admin, mod, mod_cmds) {
            document.getElementById("permissions-form").innerHTML = \`
                <div class="input-group">
                    <input type="checkbox" id="perm-admin" class="perm" onchange="chkin()" \${admin ? "checked" : ""}>
                    <label for="perm-admin">Access Admin Portal (this page)</label>
                </div><br/>
                <div class="input-group">
                    <input type="checkbox" id="perm-mod" class="perm" value="" onchange="chkin()" \${mod ? "checked" : ""}>
                    <label for="perm-mod">Access <a href="/mod">Server Moderation Portal</a></label>
                </div><br/>
                <div class="input-group">
                    <input type="checkbox" id="perm-mod_cmds" class="perm" value="" onchange="chkin()" \${mod_cmds ? "checked" : ""}>
                    <label for="perm-mod_cmds">Use Server Management Commands</label>
                </div>
            \`;
        }

        function getPermissionsForm() {
            return {
                admin: document.getElementById("perm-admin").checked,
                mod: document.getElementById("perm-mod").checked,
                mod_cmds: document.getElementById("perm-mod_cmds").checked
            }
        }

        let memberSelected = null;

        function chkin() {
            // get selected member id
            const id = getId(document.getElementById("member-select").value);

            if (!id)
                return;

            // first time, picked a member
            if (!memberSelected || memberSelected != id) {
                const perms = modData.find(m => m.id == id);
                if (!perms) {
                    modData.push({ id : id });
                    showPermissions(false, false, false);
                } else {
                    showPermissions(perms.admin, perms.mod, perms.mod_cmds);
                }
                memberSelected = id;
                return;
            }

            // apply mod permissions changes
            if (memberSelected && memberSelected == id) {

                let mod = modData.findIndex(m => m.id == id);

                // promoting normal user to mod
                if (!mod) {
                    modData.push({ id : id });
                    mod = modData.length - 1;
                }

                const perms = getPermissionsForm();

                modData[mod].admin = perms.admin;
                modData[mod].mod = perms.mod;
                modData[mod].mod_cmds = perms.mod_cmds;

                return;

            }

        }


        function submit() {

            modData.filter(m => {
                    // remove members who don't have permissions
                return m.admin != undefined
                    // don't need mod entry for unpriveleged users
                || (m.admin || m.mod || m.mod_cmds);
            });


            redirect("/admin/${req.params.serverid}/apply/"
                + encodeURIComponent(JSON.stringify(modData)));
        }



    `);






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
    const perms = mods.getModData(req.params.serverid, userid);
    const guild = global.client.guilds.get(req.params.serverid);

    console.log(!!guild);
    console.log(perms.admin);


    // if authorized apply desired changes
    if (guild && perms.admin) {
        const modData = JSON.parse(decodeURIComponent(req.params.modsjson));
        console.log(modData);
        mods.setModData(guild.id, modData);
    }

    res.redirect(`/admin/${req.params.serverid}`);
}));



module.exports = router;
