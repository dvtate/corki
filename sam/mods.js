
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

function getModData(guildid, userid) {

    sam.populateServerDir(guildid);

    if (fs.existsSync(`${process.env.HOME}/.corki/servers/${serverid}/mods.json`))
        return fs.readFileSync(`${process.env.HOME}/.corki/servers/${serverid}/mods.json`);

    // else return undefined
}

module.exports.getModData = getModData;

function setModData(guildid, mods) {
    sam.makeServerDir(guildid);
    fs.writeFileSync(`${process.env.HOME}/.corki/servers/${serverid}/mods.json`, JSON.stringify(mods));
}
module.exports.setModData = setModData;
