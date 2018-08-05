
const fetch = require("node-fetch");


async function getUserID(token, res) {
    return new Promise((resolve, reject) => {
        fetch("https://discordapp.com/api/users/@me", {
            "method" : "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(data =>
            data.json().then(user => {
                if (!global.client.users.get(user.id)) {
                    res.redirect("/unknown");
                    resolve(null);
                } else
                    resolve(user.id)
            }).catch(reject)
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
    return Array.from(global.client.guilds).filter(g => g[1].members.has(userid));
}
module.exports.mutualServers = mutualServers;


const mods = require("../sam/mods");
const botAdmins = require("../bot_admins");

function adminServers(userid) {
    return mutualServers(userid).filter(g => {
        let pwr = mods.getModData(g[1].id, userid);
        return pwr.admin || botAdmins.auth(userid);
    });
}
module.exports.adminServers = adminServers;

function modServers(userid) {
    return mutualServers(userid).filter(g => {
        let pwr = mods.getModData(g[1].id, userid);
        return pwr.admin || pwr.mod || botAdmins.auth(userid);
    });
}
module.exports.modServers = modServers;
