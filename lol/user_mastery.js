const fs = require("fs");

const teemo = require("./teemo");
const lol = require("./lol_stuff");


async function refreshMasteryData(id) {
    return new Promise(async (resolve, reject) => {

        // get their lol data
        let userObj = lol.getUserData(id);
        /*if (!userObj || !userObj.accounts.length) {
            reject("no accts");
            return;
        }*/

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
                    ret[champ.championId] = {
                        pts: ret[champ.championId].pts + champ.championPoints,
                        lvl: champ.championLevel > ret[champ.championId].lvl
                                ? champ.championLevel : ret[champ.championId].lvl
                    };

                else // otherwise make new entry
                    ret[champ.championId] = {
                        pts: champ.championPoints,
                        lvl: champ.championLevel
                    };

            }));

            // cache mastery data to a file
            fs.writeFileSync(`${process.env.HOME}/.corki/users/${id}/lol-mastery.json`,
                JSON.stringify(ret));
            // return
            resolve(ret);


        }).catch(reject);


    });
}

module.exports.refresh = refreshMasteryData;


async function getUserMasteryData(id) {
    return new Promise(async (resolve, reject) => {
        let masteries;


        // attempt to read from cache file
        try {
            masteries = JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/users/${id}/lol-mastery.json`));
        } catch (e) {
            // cache file not found
            try { // get new data
                masteries = await refreshMasteryData(id);
            } catch (e) { // rito potato servers not working
                reject(e);
                return;
            }
        }

        // if data is > 15mins old, request new data
        if (!masteries || Date.now() - masteries.timestamp > 900000)
            masteries = await refreshMasteryData(id);

        resolve(masteries);
    });
}

// total number of mastery points on a specific champ across multiple accts
function getUserMastery (id, champ) {
    return new Promise(async (resolve, reject) =>
        getUserMasteryData(id)
            .then(d => resolve(d[champ] || { pts : 0, lvl : 0 }))
            .catch(e => {
                if (e == "no accts")
                    resolve({ pts : 0, lvl : 0 });
                else
                    reject(e);
            })
    );
}

module.exports.getUserMastery = getUserMastery;
