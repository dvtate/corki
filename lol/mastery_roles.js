const logCmd = require("../logging.js");

const teemo = require("./teemo.js");
const lol = require("./lol_stuff.js");
const fs = require("fs");


function removeRoles(server, member, roles) {
    const guild = global.client.guilds.get(server)
    const guildRoles = guild.roles;

    roles.forEach(role => {
        r = guildRoles.find("name", role)
        if (!!r)
            guild.members.get(member).removeRole(r);
    });
}

/*
rules =
[{
    "champ" : 42,
    "pts_roles" : {
        "0" : "newbie",
        "50000" : "50k",
        "100000" : "100k",
        "150000" : "150k",
        "200000" : "200k",
        "250000" : "250k",
        "300000" : "300k",
        "350000" : "350k",
        "400000" : "400k",
        "450000" : "450k",
        "500000" : "500k",
        "600000" : "600k",
        "700000" : "700k",
        "800000" : "800k",
        "900000" : "900k",
        "1000000" : "1 Million"
    },
    "announce" : "mastery"
}]

*/



function checkin(server) {
    let rules = JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${server}/mastery_roles_rules.json`));
    if (!rules)
        return;

    const guild = global.client.guilds.get(server);
    if (!guild)
        return;

    // proc each rule
    rules.forEach(rule => {

        let keys = Object.keys(rule.pts_roles);
        keys.sort((a, b) => b - a);
        console.log(keys);
        let roles = keys.map(k => rule.pts_roles[k]);

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
            for (let i = 0; i < keys.length; i++) {
                // find qualifying role
                if (mastery.pts > keys[i]) {
                    let role = guild.roles.find("name", roles[i]);
                    // if they dont already have this role
                    if (!member[1]._roles.includes(role.id)) {
                        removeRoles(server, member[0], roles);
                        member[1].addRole(role);

                        // announce achievement
                        if (!!rule.announce)
                            guild.channels.find("name", rule.announce).send({ embed : {
                                title: `${member[1].user.username} just got promoted to ${roles[i]}!, `,
                                description: `They currently have ${mastery.pts} points`
                            }});
                    }

                    break;
                }
            }

        });


    });

}



// 2 min checkin intervals
function refresh() {
    checkin("252833520282501122"); // corkimains server id
    setTimeout(refresh, 20000000); // every 2 mins
}
setTimeout(refresh, 10000); // give 10 seconds for bot to start before checking
