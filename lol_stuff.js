

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
            name: "",
            server: "",
            id: "num num",
            icon: num,
            accountId:""
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

async function getUserMastery (id, champ, cb) {
    return new Promise(async (resolve, reject) => {
        var data = getUserData(id);
        if (!data) {
            reject("account not found :/");
            return;
        }

        // total mastery from each of the user's accounts and return is
        var mastery = 0;

        for (let i = 0; i < data.accounts.length; i++) {

            let acctMastery = await teemo.riot.get(data.accounts[i].server,
                "championMastery.getChampionMastery", data.accounts[i].id, champ);

            mastery += !!acctMastery ? acctMastery.championPoints : 0;
        }

        resolve(mastery);
    });

}

module.exports.getUserMastery = getUserMastery;

async function addUserAcct(msg, server, username) {
    setupDir(msg.author.id, msg.channel);
    var usrObj = getUserData(msg.author.id);

    teemo.riot.get(server, "summoner.getBySummonerName", username).then(summoner => {
        usrObj.accounts = usrObj.accounts.concat({
            name: summoner.name,
            server: server,
            id: summoner.id,
            accountId: summoner.accountId,
            icon: summoner.profileIconId
        });

        setUserData(msg.author.id, usrObj);
        msg.channel.send(`${msg.author} is also ${username}`);

    }).catch(err => {
        msg.channel.send(`"${username} wasn't found on ${server}"`);
    });

}

module.exports.addUserAcct = addUserAcct;



function setUserData(id, usrObj) {
    fs.writeFileSync(`${process.env.HOME}/.corki/users/${id}/lol.json`, JSON.stringify(usrObj));
}
module.exports.setUserData = setUserData;





/*
async function postLeaderBoard() {


}
*/
