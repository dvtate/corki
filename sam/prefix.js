const fs = require("fs");
const sam = require("./sam");

function getGuildPrefixes(id){
    try {
        return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${id}/prefixes.json`));
    } catch (e) {
        return [ '-' ];
    }
}
module.exports.getGuildPrefixes = getGuildPrefixes;

function setGuildPrefixes(id, prefixes) {
    sam.makeServerDir(id);
    fs.writeFileSync(`${process.env.HOME}/.corki/servers/${id}/prefixes.json`, JSON.stringify(prefixes));
}

module.exports.setGuildPrefixes = setGuildPrefixes;


function resetGuildPrefixes(id) {
    fs.unlinkSync(`${process.env.HOME}/.corki/servers/${id}/prefixes.json`);
}
module.exports.resetGuildPrefixes = resetGuildPrefixes;

module.exports.escapeRegExp = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
