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

}

module.exports.populateServerDir = populateServerDir;


module.exports.serverDirsList = () =>
    fs.readdirSync(`${process.env.HOME}/.corki/servers`);


module.exports.pruneServerDirs = () => {
    let dirs = module.exports.serverDirsList();
    const fs = require("fs-extra");
    dirs.forEach(g => {
        if (!global.client.guilds.get(g)) {
            // edit this to make it move the bad server directory to a backup folder
            fs.removeSync(`${process.env.HOME}/.corki/servers/${g}`);
            console.log("pruned server dir: " + g);
        }
    });
}
