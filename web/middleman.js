
const fetch = require("node-fetch");


async function getUserID(token) {
    return new Promise((resolve, reject) => {
        fetch("https://discordapp.com/api/users/@me", {
            "method" : "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(data =>
            data.json().then(user =>
                resolve(user.id)
            ).catch(reject)
        ).catch(reject);
    });
}
module.exports.getUserID = getUserID


// async/await error catcher
module.exports.catchAsync = fn => (
    (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch)
            routePromise.catch(err => next(err));
    }
);



function mutualServers(userid) {

}
module.exports.mutualServers = mutualServers;
