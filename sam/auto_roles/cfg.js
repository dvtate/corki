        /// config file stuff
const fs = require("fs");
const sam = require("../sam");

/*
`${process.env.HOME}/.corki/servers/${id}/ar-config.json`
// roles:
[
    {
        role: {
            name: "",
            id: ""
        },
        cond: condition for application,
        keep: if condition is false and they have role should we leave it\?,
        announce: promotion announcement channel,
    },
]
*/

function get(id) {
    sam.makeServerDir(id);
    try {
        return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${id}/ar-config.json`));
    } catch(e) {
        if (e.code != "ENOENT")
            console.error(e);
        return [];
    }
}
module.exports.get = get;

function set(id, cfg) {
    sam.makeServerDir(id);
    fs.writeFileSync(`${process.env.HOME}/.corki/servers/${id}/ar-config.json`, JSON.stringify(cfg));
}
module.exports.set = set;

function addRule(id, role) {
    let cfg = getCfg(id);
    cfg.push(role);
    setCfg(id, cfg);
}
module.exports.addRule = addRule;
