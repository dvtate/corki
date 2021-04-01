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


async function generateModData(serverid) {

    console.log(serverid)
    const guild = await global.client.guilds.fetch(serverid);

    if (!guild)
        return null;

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
        // admin permissions (you have to manually give bot users permisions)
        // new admins not automatically added..
        if (m[1].permissions.has(global.Discord.Permissions.FLAGS.ADMINISTRATOR) && !m[1].user.bot)
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

async function getMods(guildid) {
    await sam.populateServerDir(guildid);
    return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${guildid}/mods.json`));
}
module.exports.getMods = getMods;

async function getModData(guildid, userid) {
    let ret = (await getMods(guildid)).find(m => m.id == userid);


    // botadmin override perms in case of need for debugging
    if (botAdmins.auth(userid))
        return {
            id: userid,
            admin: true,
            mod: true,
            mod_cmds: true
        };

    // not special enough to be an admin
    else if (!ret)
        return {
            id: userid,
            admin: false,
            mod: false,
            mod_cmds: false
        };

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
async function editMod(guildid, mod) {
    await sam.populateServerDir(guildid);
    await getModData(guildid)
}
module.exports.editMod = editMod;


// delete mod file
function resetMods(guildid) {
    fs.unlinkSync(fs.readFileSync(`${process.env.HOME}/.corki/servers/${guildid}/mods.json`));
}
module.exports.resetMods = resetMods;




const botAdmins = require("../bot_admins"); // is backdoor really needed?

async function isMod(guildid, userid, bot_override) {

    // prevent bot from performing actions unless override
    if (!bot_override &&
        (await global.client.users.fetch(userid)).bot)
        return false;

	let perms = await getModData(guildid, userid);

    // if they don't have roles priveleges or are a bot then stop them
    if (!botAdmins.auth(userid) && !perms.admin && !perms.mod_cmds)
        return false;

    return true;

}

module.exports.isMod = isMod;

async function auth(msg, bot_override) {
    if (!await isMod(msg.guild.id, msg.author.id, bot_override)) {
        msg.channel.send("You are not authorized to perform this action. \
Ask the server's owner to promote you to admin or grant you access to this command via the web portal\n");
        return false;
    }
    return true;
}
module.exports.auth = auth;


async function pruneMods(guildid) {
    let mods = await getMods(guildid);
    const guild = await global.client.guilds.fetch(guildid);
    if (!guild)
        return;

    await guild.members.fetch();
    mods.filter(m => guild.members.cache.has(m.id));
}