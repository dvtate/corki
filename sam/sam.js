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



// TODO:
module.exports.backupServerDirs = () => {
    // backup
    require("child_process").execSync(`cp /home/tate/.corki/servers /home/tate/.corki/servers_bkp`);
};

module.exports.pruneServerDirs = () => {
    // probaly api outage
    if (Array.from(global.client.guilds).length == 0)
        return;

    const fs = require("fs-extra");

    // delete all irrelevant server directories
    module.exports.serverDirsList().forEach(g => {
        if (!global.client.guilds.get(g)) {
            // edit this to make it move the bad server directory to a backup folder
            fs.removeSync(`${process.env.HOME}/.corki/servers/${g}`);
            console.log("pruned server dir: " + g);
        }
    });
};
