const fs = require("fs");


// make server directory if not already there
function makeServerDir(serverid){
        if (!fs.existsSync(`${process.env.HOME}/.corki/servers/${serverid}`))
            fs.mkdirSync(`${process.env.HOME}/.corki/servers/${serverid}`)
}
module.exports.makeServerDir = makeServerDir;


function populateServerDir(serverid) {
    makeServerDir(serverid);
    // fill it
}
