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
                id: summ.id, accountId: summ.accountId
            } : null);
        })).catch(e => null)
    });
    let new_accts = await Promise.all(rep_req);
    for (let i = 0; i < data.accounts.length; i++)
        if (new_accts[i])
            data.accounts[i] = new_accts[i];
    setUserData(id, data);

}
module.exports.refreshUserData = refreshUserData;

module.exports.getUserMastery = require("./user_mastery").getUserMastery;


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
                    accountId: summoner.accountId
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





const queues = {
    "RANKED_FLEX_SR" : "Flex 5:5",
    "RANKED_SOLO_5x5" : "Solo Queue",
    "RANKED_FLEX_TT" : "Flex 3:3"
};

function captitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}


async function makeRankSummary(name, acctName, rank, ) {
    return new Promise((resolve, reject) => {

        if (rank.length == 0) {
            resolve(name + " is unranked");
        } else {

            let summary = { embed: {
                title: `${name}'s Rank`,
                description: `${name} has played `,
                fields: []
            }};

            let wins = 0, losses = 0;

            rank.forEach(q => {
                wins += q.wins;
                losses += q.losses;


                summary.embed.fields = summary.embed.fields.concat({
                    name: `${queues[q.queueType]} - ${captitalizeFirstLetter(q.tier.toLowerCase())} ${q.rank} ${q.leaguePoints}LP`,
                    value: `${q.wins}W ${q.losses}L ${Math.round(q.wins / (q.wins + q.losses) * 1000)/10}%` +
                        ( !!q.miniSeries ? `\nSeries: (${q.miniSeries.progress.split("").join(") (")})` : "" )

                });
            });

            summary.embed.description += `${wins + losses} games this season ${name != acctName ? "on their account " + acctName : ""}`;

            if (name != acctName)
                summary.embed.footer = { text: "to change your main account use \`-lol main\`" };

            resolve(summary);
        }
    });
}

module.exports.makeRankSummary = makeRankSummary;
