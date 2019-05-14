/*
This file makes it so that corki ignores messages in given channels/servers
*/

const fs = require("fs");
const sam = require("./sam");


// cached as it will be needed for every single message
let blGuilds = [];
let blChans = [];


function loadChannels(gid) {
    try {
        return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${gid}/bl_chans.json`));
    } catch (e) {
        return [];
    }
}

function loadGuilds() {
    try {
        return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/bl_servers.json`));
    } catch (e) {
        return [];
    }
}

function setGuilds(json) {
    fs.writeFileSync(`${process.env.HOME}/.corki/bl_servers.json`, JSON.stringify(json));
    loadFromConf();
}

function loadFromConf() {
    blGuilds = loadGuilds();
    blChans = [];
    blChans = sam.serverDirsList()
        .map(g => loadChannels(g))
        .reduce((a, v) => a.concat(v));
}
loadFromConf();

module.exports.load = loadFromConf;

module.exports.guilds = () => { return blGuilds; };
module.exports.chans = () => { return blChans; };


module.exports.guildChans = loadChannels;
module.exports.loadGuilds = loadGuilds;
module.exports.addGuild = (gid) => {
    let gs = loadGuilds();
    gs.push(gid);
    setGuilds(gs);
}
module.exports.setGuilds = setGuilds;

function setGuildChans(id, chans) {
    fs.writeFileSync(`${process.env.HOME}/.corki/servers/${id}/bl_chans.json`, JSON.stringify(chans));
    loadFromConf();
}
module.exports.setGuildChans = setGuildChans;
