const fs = require("fs");

const logCmd = require("../logging.js");

const teemo = require("./teemo.js");
const lol = require("./lol_stuff.js");
const sam = require("../sam/sam");



function removeRoles(server, member, roles) {
    const guild = global.client.guilds.get(server)
    const guildRoles = guild.roles;

    roles.forEach(role => {
        r = guildRoles.find("name", role)
        if (!!r)
            guild.members.get(member).removeRole(r);
    });
}

module.exports.removeRoles = removeRoles;



function makeRolesFile(serverid) {
    sam.makeServerDir(serverid);
    fs.writeFileSync(`${process.env.HOME}/.corki/servers/${serverid}/mastery_roles_rules.json`, '[]');
}
module.exports.makeRolesFile = makeRolesFile;


function getRolesData(serverid) {
    sam.populateServerDir(serverid);

    try {
        return JSON.parse(
            fs.readFileSync(
                `${process.env.HOME}/.corki/servers/${serverid}/mastery_roles_rules.json`));
    } catch (e) {
        return [];
    }
}
module.exports.getRolesData = getRolesData;



function setRolesData(serverid, data) {
    sam.makeServerDir(serverid);
    fs.writeFileSync(
        `${process.env.HOME}/.corki/servers/${serverid}/mastery_roles_rules.json`,
        JSON.stringify(data));
}
module.exports.setRolesData = setRolesData;


/* example comfig
rules =
[{
    "champ" : 42,
    "pts_roles" : [
        {
            required : 0,
            role: "newbie",
            announce: false
        }, {
            required : 50000,
            role : "50k",
            announce: true
        }, {
            required : 100000,
            role : "100k",
            announce: true
        }
    ],
    "announce" : "mastery"
}]
*/



function checkin(server) {
    let rules;
    let guild;
    try {
        rules = getRolesData(server);
        guild = global.client.guilds.get(server);
    } catch (e) {
        console.log("err: corki server not found");
        return;
    }

    // proc each rule
    rules.forEach(rule => {

        let roles = rule.pts_roles.sort((a, b) => b.required - a.required);

        let members = Array.from(guild.members);

        // check each member
        members.forEach(async member => {

            // get mastery info
            try {
                var mastery = await lol.getUserMastery(member[0], rule.champ);
            } catch (e) {
                return; // no registered accounts
            }

            // see which role applies to user
            for (let i = 0; i < roles.length; i++) {

                // find qualifying role
                if (mastery.pts > roles[i].required) {

                    let role = guild.roles.find("name", roles[i].role);

                    // if they dont already have this role
                    if (!member[1]._roles.includes(role.id)) {
                        console.log("roles:", member[1]._roles.map(r => guild.roles.get(r).name));

                        console.log(`promoting ${member[1].user.username} to ${roles[i].role}`);


                        // reset and replace associate roles
                        removeRoles(server, member[0], roles);
                        member[1].addRole(role);
/*
                        // announce achievement
                        if (rule.announce && roles[i].announce)
                            guild.channels.find("name", rule.announce).send({ embed : {
                                title: `${member[1].user.username} got promoted to ${roles[i].role}!`,
                                description: `They currently have ${mastery.pts} points`
                            }});
*/

                    }

                    break;
                }
            }

        });

    });

}



function refresh() {
    sam.serverDirsList().forEach(serverid => {
        if (getRolesData(serverid).length)
            checkin(serverid);
    });
    setTimeout(refresh, 3600000); // check every hr
}
setTimeout(refresh, 20000); // give 10 seconds for bot to start before checking
