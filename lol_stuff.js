

/*


~/.corki/                       -- bot configuration and stuff
    users/                      -- users
    userid/                     -- user directory
        lol.json                -- contains league acct info
        *profile_verif.tmp*     -- tmp file for verifying acct ownership (won't be added in first iteration)


*/

const fs = require("fs");


const logCmd = require("./logging.js");

const teemo = require("./teemo.js");
const riot = teemo.riot;
const champgg = teemo.champgg;


// configures a user directory
function setupDir(id, channel) {
    if (fs.existsSync(`${process.env.HOME}/.corki/users/${id}`))
        return true;

    fs.mkdirSync(`${process.env.HOME}/.corki/users/${id}`);
    fs.writeFileSync(`${process.env.HOME}/.corki/users/${id}/lol.json`, "{ \"main\":0, \"accounts\": [] }");

    return false;
}
module.exports.setupDir = setupDir;

/*

{
    main: 0,
    accounts: [
        {
            region: "",

        }
    ]
}

*/



function getUserData (id) {

    if (!fs.existsSync(`${process.env.HOME}/.corki/users/${id}/lol.json`))
        return null;

    return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/users/${id}/lol.json`));

}
module.exports.getUserData = getUserData;

async function getAcctData (id, req, cb) {
    arguments

    const data = getUserData(id);
    if (!data)
        return null;

    var accts = data.accounts;

    for (var i = 0; i < data.length; i++) {
        data[i] = await riot.get()

    }

}

async function getUserMastery(msg, cb) {

}

module.exports.getAcctData = getAcctData;


async function addUserAcct(msg, server, username) {
    setupDir(msg.author.id, msg.channel);
    var usrObj = getUserData(msg.author.id);

    teemo.riot.get(server, "summoner.getBySummonerName", username).then(summoner => {
        usrObj.accounts = usrObj.accounts.concat({
            name: summoner.name,
            server: server,
            id: summoner.id,
            icon: summoner.profileIconId
        });

        fs.writeFileSync(`${process.env.HOME}/.corki/users/${msg.author.id}/lol.json`, JSON.stringify(usrObj));
        msg.channel.send(`${msg.author} is also ${username}`);

    }).catch(err => {
        msg.channel.send(`"${username} wasn't found on ${server}"`);
    });

}

module.exports.addUserAcct = addUserAcct;
