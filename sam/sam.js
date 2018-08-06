const fs = require("fs");
const mods = require("./mods");

// make server directory if not already there
function makeServerDir(serverid){
        if (!fs.existsSync(`${process.env.HOME}/.corki/servers/${serverid}`))
            fs.mkdirSync(`${process.env.HOME}/.corki/servers/${serverid}`)
}
module.exports.makeServerDir = makeServerDir;




function populateServerDir(serverid) {

    makeServerDir(serverid);

    //const guild = global.client.guilds.get(serverid);

    // moderation permissions file
    if (!fs.existsSync(`${process.env.HOME}/.corki/servers/${serverid}/mods.json`))
        mods.setModData(serverid, mods.generateModData(serverid));

    // self assignable roles
    if (!fs.existsSync(`${process.env.HOME}/.corki/servers/${serverID}/roles.json`))
        fs.writeFileSync(`${process.env.HOME}/.corki/servers/${serverid}/roles.json`, "[]");

}

module.exports.populateServerDir = populateServerDir;
