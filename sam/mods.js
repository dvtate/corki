const fs = require("fs");

const sam = require("./sam");


function generateModData(serverid) {

    const guild = global.client.guilds.get(serverid);

    // [ { id, admin, mod, mod_cmds } }
    let mods = [];


    if (guild.ownerID)
        mods.push({
            id: guild.ownerID,
            admin: true,
            mod: true,
            mod_cmds: true
        });

    Array.from(guild.members).forEach(m => {
        // admin permissions
        if (m[1].permissions.has(global.Discord.Permissions.FLAGS.ADMINISTRATOR))
            mods.push({
                id: m[1].id,
                admin: true,
                mod: true,
                mod_cmds: true
            });
    });

    return mods;
}
module.exports.generateModData = generateModData;

function getMods(guildid) {
    sam.populateServerDir(guildid);
    return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${guildid}/mods.json`));
}
module.exports.getMods = getMods;

function getModData(guildid, userid) {
    let ret = getMods(guildid).find(m => m.id == userid);
    if (!ret)
        ret = {
            id: userid,
            admin: false,
            mod: false,
            mod_cmds: false
        }
    return ret;
}
module.exports.getModData = getModData;


function setModData(guildid, mods) {
    sam.makeServerDir(guildid);
    fs.writeFileSync(`${process.env.HOME}/.corki/servers/${guildid}/mods.json`, JSON.stringify(mods));
}
module.exports.setModData = setModData;

function editMod(guildid, mod) {
    sam.populateServerDir(guildid);

    getModData(guildid)
}
