const fetch = require("node-fetch");
const Page = require("./page");

async function getUserID(token, res) {
    return new Promise((resolve, reject) => {
        fetch("https://discordapp.com/api/users/@me", {
            "method" : "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(async data =>
            data.json().then(user => {
                if (!await global.client.users.fetch(user.id)) {
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


async function mutualServers(userid) {
    await global.client.guilds.fetch();
    return Array.from(global.client.guilds.cache).filter(g => g[1].members.has(userid));
}
module.exports.mutualServers = mutualServers;


const mods = require("../sam/mods");
const botAdmins = require("../bot_admins");

async function adminServers(userid) {
    // TODO use Promise.all()
    const ret = [];
    for (const g of await mutualServers(userid)) {
        const pwr = await mods.getModData(g[1].id, userid);
        ret.push(pwr.admin || botAdmins.auth(userid));
    }
    return ret;
}
module.exports.adminServers = adminServers;

async function modServers(userid) {
    // TODO use Promise.all()
    const ret = [];
    for (const g of await mutualServers(userid)) {
        const pwr = await mods.getModData(g[1].id, userid);
        ret.push(pwr.admin || pwr.mod || botAdmins.auth(userid));
    }
    return ret;
}
module.exports.modServers = modServers;


function genErrorPage(userid, title, body, ptitle) {
        let page = new Page(ptitle || "Error", userid);
        page.startFieldset(title)
            .addRaw(body)
            .endFieldset();
        return page;
}
module.exports.genErrorPage = genErrorPage;
