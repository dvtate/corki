const sam = require("./sam");

function getGuildPrefixes(id){
    try {
        return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${id}/prefixes.json`));
    } catch (e) {
        return [ '-', global.client.user.toString() ];
    }
}
module.exports.getGuildPrefixes = getGuildPrefixes;

function setGuildPrefixes(id, prefixes) {
    sam.makeServerDir(id);
    fs.writeFileSync(`${process.env.HOME}/.corki/servers/${id}/prefixes.json`, JSON.stringify(prefixes));
}

module.exports.setGuildPrefixes = setGuildPrefixes;
