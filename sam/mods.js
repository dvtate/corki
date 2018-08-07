const fs = require("fs");

const sam = require("./sam");


/* Server moderators and admins file interface
    file-format: json
    containing an array of mod objects
    {
        id: relevant user id,
        admin: if the user has access to the admin portal and/or discord lists them as admin,
        mod: if the user has access to server management portal,
        mod_cmds: if the user is allowed to use the server management commands
    }

*/





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

// write mod data
function setModData(guildid, mods) {
    sam.makeServerDir(guildid);
    fs.writeFileSync(`${process.env.HOME}/.corki/servers/${guildid}/mods.json`, JSON.stringify(mods));
}
module.exports.setModData = setModData;


// edit a mods permissions
// TODO: finish pls
function editMod(guildid, mod) {
    sam.populateServerDir(guildid);

    getModData(guildid)
}
module.exports.editMod = editMod;


// delete mod file
function resetMods(guildid) {
    fs.unlinkSync(fs.readFileSync(`${process.env.HOME}/.corki/servers/${guildid}/mods.json`));
}
module.exports.resetMods = resetMods;
