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
    "pts_roles" : []
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
        }, {
            required : 150000,
            role : "150k",
            announce: true
        }, {
            required: 200000,
            role : "200k",
            announce: true
        }, {
            required: 250000,
            role : "250k",
            announce: true
        }, {
            required: 300000,
            role : "300k",
            announce: true
        }, {
            required: 350000,
            role : "350k",
            announce: true
        }, {
            required: 400000,
            role : "400k",
            announce: true
        }, {
            required: 450000,
            role : "450k",
            announce: true
        }, {
            required: 500000,
            role : "500k",
            announce: true
        }, {
            required: 600000,
            role : "600k",
            announce: true
        }, {
            required: 700000,
            role : "700k",
            announce: true
        }, {
            required: 800000,
            role : "800k",
            announce: true
        }, {
            required: 900000,
            role : "900k",
            announce: true
        }, {
            required: 1000000,
            role : "1 Million",
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
        rules = JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${server}/mastery_roles_rules.json`));
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
                    console.log(`promoting ${member.user.username} to ${roles[i].role}`);
                    
                    // if they dont already have this role
                    if (!member[1]._roles.includes(role.id)) {
                        // reset and replace associate roles
                        removeRoles(server, member[0], roles);
                        member[1].addRole(role);

                        // announce achievement
                        if (rule.announce && roles[i].announce)
                            guild.channels.find("name", rule.announce).send({ embed : {
                                title: `${member[1].user.username} got promoted to ${roles[i].role}!`,
                                description: `They currently have ${mastery.pts} points`
                            }});

                    }

                    break;
                }
            }

        });

    });

}



function refresh() {
    //checkin("319518724774166531"); // testing server
    checkin("252833520282501122"); // corkimains server id
    setTimeout(refresh, 10000000); // a few times per day
}
setTimeout(refresh, 20000); // give 10 seconds for bot to start before checking
