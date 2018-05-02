

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
    // see if they already have a user file
    if (fs.existsSync(`${process.env.HOME}/.corki/users/${id}`))
        return true;

    // make a user file
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

// total number of mastery points on a specific champ across multiple accts
function getUserMastery (id, champ, cb) {
    return new Promise(async (resolve, reject) => {

        // get their acct list
        var data = getUserData(id);
        if (!data) {
            reject("account not found :/");
            return;
        }

        // total mastery from each of the user's accounts
        var mastery = 0;

        for (let i = 0; i < data.accounts.length; i++) {

            const acctMastery = await teemo.riot.get(data.accounts[i].server,
                "championMastery.getChampionMastery", data.accounts[i].id, champ);

            mastery += !!acctMastery ? acctMastery.championPoints : 0;
        }
        // return total
        resolve(mastery);

    });

}

module.exports.getUserMastery = getUserMastery;

// associate a new acct with user
async function addUserAcct(msg, server, username) {
    return new Promise((resolve, reject) => {
        // get user info
        setupDir(msg.author.id, msg.channel);
        var usrObj = getUserData(msg.author.id);

        // get account info
        teemo.riot.get(server, "summoner.getBySummonerName", username).then(summoner => {
            usrObj.accounts = usrObj.accounts.concat({
                name: summoner.name,
                server: server,
                id: summoner.id,
                accountId: summoner.accountId,
                icon: summoner.profileIconId
            });

            // write account info
            setUserData(msg.author.id, usrObj);
            resolve();

        // catch errors
        }).catch(err => reject(err));
    });
}

module.exports.addUserAcct = addUserAcct;


// write changes to user file
function setUserData(id, usrObj) {
    fs.writeFileSync(`${process.env.HOME}/.corki/users/${id}/lol.json`, JSON.stringify(usrObj));
}
module.exports.setUserData = setUserData;
