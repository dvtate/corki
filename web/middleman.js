
const fetch = require("node-fetch");


async function getUserID(token) {
    return new Promise((resolve, reject) => {
        fetch("https://discordapp.com/api/users/@me", {
            "method" : "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(data => {

            data.json().then(user => {
                console.log(user);
                resolve(user.id)
            }).catch(reject);
        }).catch(reject);
    });
}
module.exports.getUserID = getUserID


function mutualServers(userid) {

}
module.exports.mutualServers = mutualServers;
