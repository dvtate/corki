const request = require("request");


// whatismymmr.com currently only supports na, euw, and eune servers
const serverNames = {
    "na1" : "na",
    "euw1" : "euw",
};

async function getMMRData(server, summoner) {
    return new Promise((resolve, reject) => {

        const options = {
            url: `https://${serverNames[server] || server}.whatismymmr.com/api/v1/summoner?name=${summoner}`,
            headers: {
            'User-Agent': 'request'
            }
        };

        request(options, (err, resp, body) => {
            if (err)
                reject(err);
            else
                resolve(body);
        });

    });
}
module.exports.getMMRData = getMMRData;
