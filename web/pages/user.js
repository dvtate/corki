
const fs = require("fs");
const fetch = require("node-fetch");
const request = require("request");
const btoa = require("btoa");

const express = require("express");
const router = express.Router();


const logCmd = require("../../logging");

const bot = require("../middleman.js");
const Page = require("../page.js");


const lol = require("../../lol/lol_stuff");
const teemo = require("../../lol/teemo");

const reddit_id = "fcn1qC1IsC7JQw";
const reddit_secret = `${fs.readFileSync(`${process.env.HOME}/.corki/reddit_secret`)}`.trim();


router.get("/user", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/user");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token);

    let page = new Page("User Settings", userid, "/user");
    page.startFieldset(`League of Legends Accounts`)
        .addRaw(`
            <button type="button" onclick="redirect('/user/lol/import/reddit')">Import from Reddit</button>
            <button type="button" onclick="redirect('/user/lol/reset')">Clear Accounts</button>
        `);

    lol.setupDir(userid);
    let data = lol.getUserData(userid);

    let table = [];

    for (let i = 0; i < data.accounts.length; i++) {
        let entry = [];
        entry.push(teemo.serverNames[data.accounts[i].server].toUpperCase());
        entry.push(data.accounts[i].name);
        entry.push(`
            <button type="button" onclick="redirect('/user/lol/rm/${data.accounts[i].id}')">Delete</button>
            ${ data.main == i ? "" :
            `<button type="button" onclick="redirect('/user/lol/main/${data.accounts[i].id}')">Main</button>`}`)
        table.push(entry);
    }


    page.addTable(["Region", "Name", "Actions"], table);

    if (table.length == 0)
        page.addRaw("<center><h4>You have no linked accounts</h4></center>");

    page.addRaw(`
        <script>
            function addAcct(){
                let region = document.getElementById("lol-add-acct-region").value;
                let name = document.getElementById("lol-add-acct-name").value;
                name = name.split("").filter(c => c != ' ' && c != '/').join("");

                if (name.length == 0) {
                    document.getElementById("lol-add-acct-name").style.border = "1px solid red";
                    return;
                }

                redirect("/user/lol/add/" + region + '/' + name);

            }
        </script>
        <hr/>
        Add account: <select id="lol-add-acct-region">
            <option value="br">BR</option>
            <option value="eune">EUNE</option>
            <option value="euw">EUW</option>
            <option value="jp">JP</option>
            <option value="kr">KR</option>
            <option value="lan">LAN</option>
            <option value="las">LAS</option>
            <option value="na">NA</option>
            <option value="tr">TR</option>
            <option value="ru">RU</option>
            <option value="pbe">pbe</option>

        </select>
        <input id="lol-add-acct-name" type="text" placeholder="summoner name"/>
        <button type="button" onclick="addAcct()">Add</button>
        `);

    page.endFieldset()
        .add(`<h2>This page isn't done yet :/</h2>`)

    res.send(page.export());
}));

router.get("/user/lol/reset", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/user");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token);
    if (!userid) {
        res.redirect("/login/user");
        return;
    }

    logCmd(null, `web@${global.client.users.get(userid).username} reset their LoL accts`);
    lol.removeDir(userid);
    res.redirect("/user");
}));


// unlink an account
router.get("/user/lol/rm/:id([0-9]+)", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/user");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token);
    if (!userid) {
        res.redirect("/login/user");logCmd(null, `web@${global.client.users.get(userid).username} reset their LoL accts`);
        return;
    }

    logCmd(null, `web@${global.client.users.get(userid).username} removed a LoL acct`);
    let data = lol.getUserData(userid);
    data.accounts = data.accounts.filter(a => a.id != req.params.id);

    // verify valid main acct index
    if (data.main >= data.accounts.length && data.accounts.length != 0)
        data.main = data.accounts.length - 1;

    lol.setUserData(userid, data);

    res.redirect("/user");
}));

// set an account to main account
router.get("/user/lol/main/:id([0-9]+)", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/user");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token);
    if (!userid) {
        res.redirect("/login/user");
        return;
    }
    logCmd(null, `web@${global.client.users.get(userid).username} changed main LoL acct`);
    let data = lol.getUserData(userid);
    data.main = data.accounts.findIndex(a => a.id == req.params.id);
    lol.setUserData(userid, data);

    res.redirect("/user");
}));


router.get("/user/lol/add/:region([a-u]+)/:name", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/user");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token);
    if (!userid) {
        res.redirect("/login/user");
        return;
    }

    let summoner, page;
    try {
        summoner = await teemo.riot.get(teemo.serverNames[req.params.region], "summoner.getBySummonerName", req.params.name);
    } catch (e) {
        page = new Page("Error", userid, "/user");
        page.startFieldset("That didn't work :/")
            .addRaw(`<h2>That summoner could not be found</h2><hr/>Make sure there aren't any mistakes and try again.
                        <button type="button" onclick="redirect('/user')">Try Again</button>`)
            .endFieldset();
        res.send(page.export());
        return;
    }

    if (!summoner) {
        page = new Page("Error", userid, "/user");
        page.startFieldset("That didn't work :/")
            .addRaw(`<h2>That summoner could not be found</h2><hr/>Make sure there aren't any mistakes and try again.
                        <button type="button" onclick="redirect('/user')">Try Again</button>`)
            .endFieldset();
        res.send(page.export());
        return;
    }


    page = new Page("Verify Account", userid, "/user/lol/add/verify");
    page.startFieldset("Verify League of Legends Account");

    let pend = {
        icon: summoner.profileIconId == 20 ? 23 : 20,
        region: teemo.serverNames[req.params.region],
        summoner: req.params.name
    };

    fs.writeFileSync(`${process.env.HOME}/.corki/users/${userid}/pending.json`, JSON.stringify(pend));

    page.addRaw("<p>In order to verify that you own this account, please change your profile icon to the following:</p><br/>")
        .addImage(`/resources/lol-icon-${pend.icon}.png`, `Icon#${pend.icon}`)
        .addRaw(`<br/><p>Once you have done this, press the button to link your account</p>
            <br/><button type="button" onclick="redirect('/user/lol/add/verify')">Link account</button>`)
        .endFieldset()
        .addRaw("<h4>Almost there!</h4>");

    res.send(page.export());

}));

// when
router.get("/user/lol/add/verify", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/user");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token);
    if (!userid) {
        res.redirect("/login/user");
        return;
    }

    if (!fs.existsSync(`${process.env.HOME}/.corki/users/${userid}/pending.json`)) {
        res.redirect("/user");
        return;
    }
    let pend = JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/users/${userid}/pending.json`));
    teemo.riot.get(pend.region, "summoner.getBySummonerName", pend.summoner).then(summoner => {

        if (!summoner)
            throw "summoner DNE";

        console.log("verify: ", summoner);
        if (summoner.profileIconId == pend.icon) {

                logCmd(null, `[web]@${global.client.users.get(userid).username} added a LoL acct`);
                lol.addUserAcct(userid, pend.region, pend.summoner)
                    .then(() => res.redirect("/user"))
                    .catch(e => { throw e });

        } else {
            res.redirect("/user/lol/add/failed");
        }
    }).catch(e => {
        res.redirect("/user");
        return;
    });


}));

// if they failed verification check
router.get("/user/lol/add/failed", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/user");
        return;
    }

    const userid = await bot.getUserID(req.cookies.token);
    if (!userid) {
        res.redirect("/login/user");
        return;
    }


    let page = new Page("Error", userid, '/user');
    page.startFieldset("That didn't work :/")
        .addRaw(`<h2>Account Failed Verification</h2><hr/>Make sure there aren't any mistakes and try again.
                    <button type="button" onclick="redirect('/user')">Try Again</button>`)
        .endFieldset();
    res.send(page.export());

}));

// reddit login for oauth2
router.get("/user/lol/import/reddit", (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/user");
        return;
    }

    const redirect = encodeURIComponent(`http://${req.headers.host}/user/lol/import/reddit/cb`);
    res.redirect(`https://www.reddit.com/api/v1/authorize?client_id=${reddit_id}&response_type=code&state=${req.cookies.token}&redirect_uri=${redirect}&duration=temporary&scope=identity`);
});


// retrieve cb code and get token + username
// require("request")( "http://flairs.championmains.com/api/user-summoners?username=dvtate" , (err, resp, body) => msg.channel.send(body) )
router.get("/user/lol/import/reddit/cb", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/user");
        return;
    }

    const redirect = encodeURIComponent(`http://${req.headers.host}/user/lol/import/reddit/cb`);

    if (!req.query.code)
        throw new Error("NoCodeProvided");

    const response = await fetch(`https://www.reddit.com/api/v1/access_token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${redirect}`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${btoa(`${reddit_id}:${reddit_secret}`)}`,
        }
    });

    const json = await response.json();
    const token = json.access_token;

    let user = await fetch("https://oauth.reddit.com/api/v1/me", {
        "method" : "GET",
        headers: {
            "Authorization": `bearer ${token}`,
            "User-Agent": "Corki Bot by dvtate"
        }
    });
    user = await user.json();

    const userid = await bot.getUserID(req.cookies.token);
    if (!userid) {
        res.redirect("/login/user");
        return;
    }

    request(`http://flairs.championmains.com/api/user-summoners?username=${user.name}`, async (err, resp, body) => {
        if (err)
            throw new Error(err);

        let accts;
        try {
            accts = JSON.parse(body).result;
        } catch (e) {
            res.redirect("/user/lol/import/reddit/none");
            return;
        }

        logCmd(null, `web@${global.client.users.get(userid).username} added LoL acct(s) from reddit`);

        // unfortunately i have to run one at a time or else only one will be added
        // due to multiple async fxn calls modifying same file at same time
        for (let i = 0; i < accts.length; i++)
            await lol.addUserAcct(userid, teemo.serverNames[accts[i].region.toLowerCase()], accts[i].name);


        res.redirect("/user");

    });

}));

router.get("/user/lol/import/reddit/none", (req, res) => {
    
    
    const userid = await bot.getUserID(req.cookies.token);
    if (!userid) {
        res.redirect("/login/user");
        return;
    }
    
    
    let page = new Page("Error", userid, "/user");
    page.startFieldset("Couldn't find anything useful")
        .add(`<p>The account you logged in with doesn't appear to have any league
            of legends accounts linked to the <a href="https://www.reddit.com/r/ChampionMains/">/r/championmains</a>
            flair system.</p>
            <button type="button" onclick="redirect('/user')">Go Back</button>
            <button type="button" onclick="redirect('http://flairs.championmains.com/')">Set up account</button>`)
        .endFieldset();
});


module.exports = router;
