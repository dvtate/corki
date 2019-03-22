/*
~/.corki/                       -- bot configuration and stuff
    users/                      -- users
    userid/                     -- user directory
        lol.json                -- contains league acct info
*/

const fs = require("fs");


const logCmd = require("../logging.js");

const teemo = require("./teemo.js");
const riot = teemo.riot;
const champgg = teemo.champgg;



// configures a user directory
function setupDir(id) {
    // see if they already have a user file
    if (!fs.existsSync(`${process.env.HOME}/.corki/users/${id}`))
        fs.mkdirSync(`${process.env.HOME}/.corki/users/${id}`);

    if (!fs.existsSync(`${process.env.HOME}/.corki/users/${id}/lol.json`))
        fs.writeFileSync(`${process.env.HOME}/.corki/users/${id}/lol.json`, "{ \"main\":0, \"accounts\": [] }");

}

module.exports.setupDir = setupDir;

async function removeDir(id) {
    // if they don't already have a dir
    if (!fs.existsSync(`${process.env.HOME}/.corki/users/${id}`))
        return true;

    // remove user file
    fs.unlink(`${process.env.HOME}/.corki/users/${id}/lol.json`, e => {
        if (e)
            console.log(e);
    });


}
module.exports.removeDir = removeDir;

/*

{
    main: 0,
    accounts: [
        {
            name: "",
            server: "",
            id: "num num",
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

async function refreshUserData(id) {
    let data = getUserData(id);
    if (!data || !data.accounts) return;

    // array of promises of account objects
    let rep_req = data.accounts.map(a =>
        (new Promise(async (resolve, reject) => {
            const summ = await teemo.riot.get(a.server, "summoner.getBySummonerId", a.id);
            resolve(summ ? { // new user obj
                name: summ.name, server: a.server,
                id: summ.id, accountId: summ.accountId,
                puuid: summ.puuid
            } : null);
        })).catch(e => null)
    );
    let new_accts = await Promise.all(rep_req);
    for (let i = 0; i < data.accounts.length; i++)
        if (new_accts[i])
            data.accounts[i] = new_accts[i];

    setUserData(id, data);

}
module.exports.refreshUserData = refreshUserData;

module.exports.getUserMastery = require("./user_mastery").getUserMastery;

module.exports.hasAccts  = id => fs.existsSync(`${process.env.HOME}/.corki/users/${id}/lol.json`);
module.exports.usersList = () => fs.readdirSync(`${process.env.HOME}/.corki/users`).filter(module.exports.hasAccts);


// associate a new acct with user
async function addUserAcct(id, server, username) {
    return new Promise((resolve, reject) => {
        // get user info
        setupDir(id);
        let usrObj = getUserData(id);

        // get account info
        teemo.riot.get(server, "summoner.getBySummonerName", username).then(summoner => {
            if (!summoner) {
                reject("invalid summoner");
                return;
            }
            if (!usrObj.accounts.find(acct => acct.id == summoner.id)) {
                usrObj.accounts.push({
                    name: summoner.name,
                    server: server,
                    id: summoner.id,
                    accountId: summoner.accountId,
                    puuid: summoner.puuid
                });

                // write account info
                setUserData(id, usrObj);
            }
            resolve();

        // catch errors
        })//.catch(err => reject(err));
    });
}

module.exports.addUserAcct = addUserAcct;


// write changes to user file
function setUserData(id, usrObj) {
    fs.writeFileSync(`${process.env.HOME}/.corki/users/${id}/lol.json`, JSON.stringify(usrObj));
}
module.exports.setUserData = setUserData;

module.exports.rank = require("./rank");
