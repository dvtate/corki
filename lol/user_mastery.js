const fs = require("fs");

const teemo = require("./teemo");
const lol = require("./lol_stuff");

/// this file is focused on the caching of user mastery points to reduce riot api calls

/*
~/.corki/user/___user_id___/lol-mastery.json :

{
    "champId" : {           // order is important here:
        pts : mastery points,
        lvl : mastery level,
    },
    "timestamp" : epoch_milisecond,
}

*/


let cache = {};


async function nativeLogMasteryData(id, data) {
    //const data = fs.readFileSync(`${process.env.HOME}/.corki/users/${id}/lol-mastery.json`);

    /* lol-mastery.c_parse
    timestamp
    champid:pts
    champid:pts
    champid:pts
    ...
    */

    const ret = "";
    ret += data.timestamp;
    delete data.timestamp;
    Object.keys(data).forEach(champ => ret += `\n${champ}:${data[champ].pts}`);

    const data_resp = fs.writeFileSync(`${process.env.HOME}/.corki/users/${id}/lol-mastery.c_parse`, ret);
    require("child_process").exec(`${process.env.HOME}/.corki/lol_mastery_log_tool ${id}`);
}

//
async function refreshMasteryData(id) {
    return new Promise(async (resolve, reject) => {

        // get their lol data
        let userObj = lol.getUserData(id);
        if (!userObj || !userObj.accounts.length) {
            reject("no accts");
            return;
        }

        // fill a list with mastery promise requests
        let dreqs = userObj.accounts.map(a =>
            teemo.riot.get(a.server, "championMastery.getAllChampionMasteries", a.id)
                .catch(e => {
                    console.error("lol-mastery err ignored...");
                    return [];
        }));

        // request them all at once
        Promise.all(dreqs).then(accts => {

            let ret = {
                timestamp: Date.now() // used to determine relevance of data
            };

            // combine relevant data into one big list
            accts.forEach(acct => acct.forEach(champ => {
                // if already an entry increase it's value
                if (ret[champ.championId])
                    ret[champ.championId] = { // NOTE: DO NOT CHANGE ORDER!
                        pts: ret[champ.championId].pts + champ.championPoints,
                        lvl: champ.championLevel > ret[champ.championId].lvl
                                ? champ.championLevel : ret[champ.championId].lvl
                    };

                else // otherwise make new entry
                    ret[champ.championId] = { // NOTE: DO NOT CHANGE ORDER!
                        pts: champ.championPoints,
                        lvl: champ.championLevel
                    };

            }));

            // cache mastery data to a file
            //fs.writeFileSync(`${process.env.HOME}/.corki/users/${id}/lol-mastery.json`, JSON.stringify(ret));
            cache[id] = ret;

            // return
            resolve(ret);

            //nativeLogMasteryData(id, ret);

        }).catch(e => {
            if (cache[id]) {
                cache[id].timestamp = Date.now();
                resolve(cache[id]);
            } else {
                reject(e);
            }
        });


    });
}

module.exports.refresh = refreshMasteryData;

//
async function getUserMasteryData(id) {
    return new Promise(async (resolve, reject) => {
        try {
            // try to pull from cache
            let masteries = cache[id];

            // if data is > 15mins old, request new data
            if (!masteries || Date.now() - masteries.timestamp > 900000)
                masteries = await refreshMasteryData(id);

            resolve(masteries);
        } catch(e) {
            reject(e);
        }
    });
}
module.exports.getUserMasteryData = getUserMasteryData;


// total number of mastery points on a specific champ across multiple accts
function getUserMastery (id, champ) {
    return new Promise((resolve, reject) =>
        getUserMasteryData(id)
            .then(d => resolve(d[champ] || { pts : 0, lvl : 0 }))
            .catch(e => {
                if (e == "no accts")
                    resolve({ pts : 0, lvl : 0, e: "no_accts" });
                else
                    reject(e);
            })
    );
}
module.exports.getUserMastery = getUserMastery;
