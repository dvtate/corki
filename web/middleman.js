const Page = require("./page");

async function getUserID(token, res) {
    return new Promise((resolve, reject) => {
        fetch("https://discordapp.com/api/users/@me", {
            "method" : "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(data =>
            data.json().then(async user => {
                const u = await global.client.users.fetch(user.id);
                if (!u) {
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
    const ret = [];
    for (const g of Array.from(global.client.guilds.cache)) {
         try {
             if (await g[1].members.fetch(userid))
                 ret.push(g); 
         } catch(e) {}
    }
    return ret;
}
module.exports.mutualServers = mutualServers;


const mods = require("../sam/mods");
const botAdmins = require("../bot_admins");

async function adminServers(userid) {
    // TODO use Promise.all()
    const ret = [];
    for (const g of await mutualServers(userid)) {
        const pwr = await mods.getModData(g[1].id, userid);
	if (pwr.admin || botAdmins.auth(userid))
	    ret.push(g);
    }
    return ret;
}
module.exports.adminServers = adminServers;

async function modServers(userid) {
    // TODO use Promise.all()
    const ret = [];
    for (const g of await mutualServers(userid)) {
        const pwr = await mods.getModData(g[1].id, userid);
        if (pwr.admin || pwr.mod || botAdmins.auth(userid))
            ret.push(g);
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
