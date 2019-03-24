/// check role conditions every 20 mins or so
const sam = require("../sam");
const ar_cond = require("./condition");
const cfg = require("./cfg");

/*
`${process.env.HOME}/.corki/servers/${id}/ar-config.json`
// rules:
[
    {
        role: {
            name: "",
            id: ""
        },
        cond: condition for application,
        keep: if condition is false and they have role should we leave it\?,
        announce: { promotion announcement channel,
            name: "",
            id: "",
            msg: "condition expression which should evaluate to a string"
        }
    },
]
*/

async function processMember(g, m, r) {
    const cond = !!await ar_cond.parseCondition(g.id, m.user.id, r.cond);
    const has_role = !!m.roles.find(role => role.name == r.role.name) || m.roles.get(r.role.id);

    //console.log("cond: ", !!cond, "has_role: ", !!has_role, "username: ", m.user.username);
    // no action needed
    if (cond == has_role) {
        return;

    } else if (cond && !has_role) {
        const role = g.roles.find(role => role.name == r.role.name) || g.roles.get(r.role.id);
        if (!role)
            return console.error("invalid role: ", JSON.stringify(r.role));

        m.addRole(role);

        if (r.announce) {
            const chan = g.channels.find(c => c.name == r.announce.name) || g.channels.get(r.announce.id);
            if (!chan)
                return console.error("invalid channel: ", JSON.stringify(r.announce));

            let msg = { embed: {
                    title: `${m.nickname || m.user.username} got promoted to ${role.name}!`
            }};
            if (r.announce.msg)
                msg.embed.description = await ar_cond.parseCondition(g, m.user.id, r.announce.msg);
            //console.log(msg);
            chan.send(msg);
        }

    } else if (!cond && has_role && !r.keep) {
        const role = g.roles.find(role => role.name == r.role.name) || g.roles.get(r.role.id);
        //console.log("removeed role: ", role.name, r.role.name)
        if (!role)
            return console.error("invalid role: ", JSON.stringify(r.role));

        m.removeRole(role);
    }
}



async function processGuild(guildid, rules) {
    let guild = await global.client.guilds.get(guildid).fetchMembers();

    // process each rule in order
    for (let i = 0; i < rules.length; i++) {
    //    console.log("rule: ", rules[i].role.name, rules[i].cond);
        let memberProcs = guild.members.array().map(m => processMember(guild, m, rules[i]).catch(console.error));
        let _ = await Promise.all(memberProcs);
    }
}

// for each server dir
// process roles
function chkin() {

    sam.serverDirsList().forEach(g => {
        try {
            const rules = cfg.get(g);
            if (rules.length)
                processGuild(g, rules).catch(console.error);
        } catch (e) {
            console.error(e);
        }
    });

}

module.exports.chkin = chkin;



// run daemon
function refresh() {
    chkin();               // check feeds and forward new ones
    setTimeout(refresh, 900000); // every 15mins
}

// start daemon
setTimeout(refresh, 10000); // give 20 seconds for bot to start before checking
