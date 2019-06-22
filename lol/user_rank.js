
const fs = require("fs");

const teemo = require("./teemo");
const lol = require("./lol_stuff")


let cache = {};

//
/*
{
    "queue" : [ ranks ],
}
*/
async function refreshData(id) {
    return new Promise((resolve, reject) => {
        let userObj = lol.getUserData(id);

        // no accts.
        if (!userObj || !userObj.accounts.length)
            resolve({});

        if (userObj.hide_rank)
            resolve({});

        let dreqs = userObj.accounts.map(a =>
            teemo.riot.get(a.server, "league.getLeagueEntriesForSummoner", a.id));

        Promise.all(dreqs).then(ranks => {
            //console.log(ranks);
            let ret = { timestamp : Date.now() };

            ranks.forEach(rank => rank.forEach(q => {
                if (!ret[q.queueType])
                    ret[q.queueType] = [];
                ret[q.queueType].push(teemo.convertRank(q.tier, q.rank));

                if (!ret["wins"])
                    ret["wins"] = 0;
                if (!ret["losses"])
                    ret["losses"] = 0;
                ret["wins"] += q.wins;
                ret["losses"] += q.losses;
            }));

            resolve(cache[id] = ret);





            // if it fails, try to update timestamp, otherwise return no ranks
        }).catch(e => {
            console.log("user-rank error...");
            console.error(e);
            if (cache[id])
                cache[id].timestamp = Date.now();
        });
    });
}
module.exports.refreshData = refreshData;


async function getData(id) {
    return new Promise((resolve, reject) => {
        if (cache[id] && (!cache[id].timestamp || Date.now() - cache[id].timestamp < 600000))
            resolve(cache[id]);
        else
            refreshData(id).then(resolve).catch(reject);
    });
}
module.exports.getData = getData;



module.exports.resetCache = id => {
    if (!id)
        cache = {};
    else
        delete cache[id];
};
