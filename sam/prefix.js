const fs = require("fs");
const sam = require("./sam");


function genCacheData() {
    sam.serverDirsList().forEach(gid => {
        cached_guild_prefixes[gid] = loadGuildPrefixes(gid);
    });
}
module.exports.genCacheData = genCacheData;

/*
{
    "serverid" : ['-', '+' ],
    "serverid" : ['-', '+' ],
    "serverid" : ['-', '+' ],
    ...
}
*/

let cached_guild_prefixes = {};
genCacheData();



function loadGuildPrefixes(id) {
    try {
        return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${id}/prefixes.json`));
    } catch (e) {
        return [ '-' ];
    }
}
module.exports.loadGuildPrefixes = loadGuildPrefixes;

function getGuildPrefixes(id){
    let ret = cached_guild_prefixes[id];
    if (!ret) {
        genCacheData();
        ret = cached_guild_prefixes[id] = loadGuildPrefixes(id);
    }
    return ret;
}
module.exports.getGuildPrefixes = getGuildPrefixes;

function setGuildPrefixes(id, prefixes) {
    sam.makeServerDir(id);
    fs.writeFileSync(`${process.env.HOME}/.corki/servers/${id}/prefixes.json`, JSON.stringify(prefixes));
    genCacheData();
}

module.exports.setGuildPrefixes = setGuildPrefixes;


function resetGuildPrefixes(id) {
    fs.unlinkSync(`${process.env.HOME}/.corki/servers/${id}/prefixes.json`);
    genCacheData();
}
module.exports.resetGuildPrefixes = resetGuildPrefixes;

module.exports.escapeRegExp = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
