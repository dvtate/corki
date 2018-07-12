
const fetch = require("node-fetch");


async function getUserID(token) {
    return new Promise((resolve, reject) => {
        fetch("https://discordapp.com/api/users/@me", {
            "method" : "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }).then(data => {
            data.json().then(user => resolve(user.id)).catch(reject);
        }).catch(reject);
    });
}
module.exports.getUserID = getUserID


function userServers(userid) {

}
module.exports.userServers = userServers;
