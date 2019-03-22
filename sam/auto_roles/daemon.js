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


async function processServer(id, rules) {
    const g = id;
    const guild = global.client.guilds.get(id);
    for (let i = 0; i < rules.length; i++) {
        r = rules[i];
        console.log("processing rule for role: ", r.role.name);
        let reqs = guild.members.array().map(m => (async m => {

            const cond = await ar_cond.parseCondition(g, m.user.id, r.cond);
            const has_role = m.roles.get(r.role.id) || m.roles.find(role => role.name == r.role.name);
            console.log("cond: ", !!cond, "has_role: ", !!has_role);
            // no action needed
            if (!!cond == !!has_role) {
                return;

            } else if (cond && !has_role) {
                const role = guild.roles.get(r.role.id) || m.roles.find(role => role.name == r.role.name);
                if (!role)
                    return console.error("invalid role: ", JSON.stringify(r.role));

                m.addRole(role);

                if (r.announce) {
                    const chan = guild.channels.get(r.announce.id) || guild.channels.find(c => c.name == r.announce.name);
                    if (!chan)
                        return console.error("invalid channel: ", JSON.stringify(r.announce));

                    let msg = { embed: {
                            title: `${m.nickname || m.user.username} got promoted to ${role.name}!`
                    }};
                    if (r.announce.msg)
                        msg.embed.description = await ar_cond.parseCondition(g, m.user.id, r.announce.msg);
                    chan.send(msg);
                }

            } else if (!cond && has_role && !r.keep) {
                const role = guild.roles.get(r.role.id) || m.roles.find(role => role.name == r.role.name);
                if (!role)
                    return console.error("invalid role: ", JSON.stringify(r.role));

                m.removeRole(role);
            }
        })(m).catch(console.error));
        await Promise.all(reqs);
    }
}

// for each server dir
// process roles
function checkRoles() {


    sam.serverDirsList().forEach(g => {
        const rules = cfg.get(g);
        if (rules.length)
            processServer(g, rules).catch(console.error);
    });

}

module.exports.chkin = checkRoles;



// run daemon
function refresh() {
    checkRoles();               // check feeds and forward new ones
    setTimeout(refresh, 1200000); // every 20mins
}

// start daemon
setTimeout(refresh, 10000); // give 20 seconds for bot to start before checking
