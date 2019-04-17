
const fs = require("fs");

const teemo = require("./teemo");
const lol = require("./lol_stuff")

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
            teemo.riot.get(a.server, "league.getAllLeaguePositionsForSummoner", a.id));

        Promise.all(dreqs).then(ranks => {

                let ret = {
                    timestamp: Date.now()
                };

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

                resolve(ret);

                // cache mastery data to a file
                fs.writeFileSync(`${process.env.HOME}/.corki/users/${id}/lol-rank.json`,
                    JSON.stringify(ret));

            }

        // if it fails, try to update timestamp, otherwise return no ranks
        ).catch(e => {
            console.log("user-rank error...");
            let rdata = {};
            try {
                rdata = JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/users/${id}/lol-rank.json`));
                rdata.timestamp = Date.now();
            } catch (e) { }
            fs.writeFileSync(`${process.env.HOME}/.corki/users/${id}/lol-rank.json`, JSON.stringify(rdata));
        });
    });
}
module.exports.refreshData = refreshData;


async function getData(id) {
    return new Promise((resolve, reject) => {
        let rdata;
        try {
            rdata = JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/users/${id}/lol-rank.json`));
            //console.log("rdata: ", rdata);

            if (!rdata.timestamp)
                resolve(rdata);

            // data > 10mins old
            if (Date.now() - rdata.timestamp > 600000)
                throw "fuckin ancient data";
        } catch (e) {
             refreshData(id).then(resolve).catch(reject);
             return;
        }
        resolve(rdata);
    });
}
module.exports.getData = getData;
