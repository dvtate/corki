

const fs = require("fs");

const Parser = require("rss-parser");

const logCmd = require("../logging.js");



/*
// list of rss rules
rss-data: [
    // all data associated with rss rule
    rule: {
        channels: [ channel-ids,,,],
        url: RSS feed URL,
        latest: date most recent post,
    }

]
*/

(function configure() {
    if (!fs.existsSync(`${process.env.HOME}/.corki/rss.conf`))
        fs.writeFileSync(`${process.env.HOME}/.corki/rss.conf`, "[]");
})();

function getRules() {
    try {
        return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/rss.conf`));
    } catch (e) {
        return [];
    }
}
module.exports.getRules = getRules;

function setRules(rules) {
    fs.writeFileSync(`${process.env.HOME}/.corki/rss.conf`, JSON.stringify(rules));
}

async function testFeedUrl(url) {
    return new Promise(async (resolve, reject) => {
        const parser = new Parser();

        let feed;
        try {
            feed = await parser.parseURL(url);
        } catch (e) {
            reject(e);
            return;
        }

        resolve();
    });
}
module.exports.testFeedUrl = testFeedUrl;

function addRule(channelID, url) {
    let rules = getRules();
    const rule = rules.findIndex(r => r.url == url);

    // no other channels are using this rule
    if (rule < 0) {
        rules.push({
            channels : [ channelID ],
            url : url,
            latest : Date.now() // replace with zero if you want spam every time you add a sub
        });
    } else {
        rules[rule].channels.push(channelID);
    }



    setRules(rules);
}

module.exports.addRule = addRule;


function removeChannel(channelID) {
    let rules = getRules();
    let l = rules.length;

    // remove channelID from all rules
    rules.forEach(r =>
        r.channels = r.channels.filter(c =>
            c != channelID))

    // remove rules which dont have any channels
    rules = rules.filter(r => !!r.channels.length);

    // write to RSS.conf
    setRules(rules);

    return l - rules.length;
}

module.exports.removeChannel = removeChannel;



async function sendItems(items, channel) {

    //console.log("forwarding rss update(s)");

    try {
        const chan = await global.client.channels.cache.get(channel);

        // channel deleted, no more feeds
        if (!chan)
            return removeChannel(channel);

        items.forEach(e => chan.send(`${e.title} ${e.link}`));
    } catch (e) {
        console.error(e);
    }

}

async function processRule(rule) {

    return new Promise(async (resolve, reject) => {
        const parser = new Parser();

        let feed;
        try {
            feed = await parser.parseURL(rule.url);
        } catch (e) {
            reject(e);
            return;
        }

        // idk where this coming from
        if (!feed) {
            return;
            console.err("no feed");
        }

        let ret = [];
        let latest = 0;
        feed.items.forEach(item => {
            if (Date.parse(item.pubDate) > rule.latest) {
                // add to list of
                ret.push(item);

                // update latest post time
                latest = Date.parse(item.pubDate) > latest ? Date.parse(item.pubDate) : latest;
            }
        });

        // update latest post time
        rule.latest = latest > 0 ? latest : rule.latest;

        resolve({ items : ret, rule : rule});
    });

}

// check feeds and forward new ones
function checkFeeds() {
    let rules = getRules();

    // make an array full of promises of new rss elements
    let requests = rules.map(r =>
        processRule(r).catch(e => {
            console.error("rss error: ", e.message);
            return { items : [], rule : r };
        })
    );

    // make request
    Promise.all(requests).then(results => {

        // foreach rule
        for (let i = 0; i < results.length; i++) {
            // update date on rule
            rules[i].latest = results[i].rule.latest;

            // if there are items, send them
            if (results[i].items.length)
                results[i].rule.channels.forEach(channel =>
                    sendItems(results[i].items, channel)
                );
        }

        // if someone added a new rule while we were posting
        if (rules.length > getRules().length)
            rules = rules.concat(getRules().slice(rules.length));

        // someone removed a rule while we were posting
        else if (rules.length < getRules().length)
            ; // not sure how to implement yet
        // errors resulting from this bad implementation would appear as commands


        setRules(rules);

    });
}


// checks for posts
function refresh() {
    checkFeeds();               // check feeds and forward new ones
    setTimeout(refresh, 60000); // every min
}
setTimeout(refresh, 20000); // give 20 seconds for bot to start before checking



async function serverRules(guildid) {
    // array text channel ids for server
    const guild = await global.client.guilds.fetch(guildid);
    const chans = Array.from(await guild.channels.fetch())
            .filter(c => c[1].type == "text").map(c => c[1].id);

    const rules = getRules();
    let ret = [];

    // if rule has one of the chans in it add it to ret
    chans.forEach(c =>
        rules.forEach(r => {
            if (r.channels.includes(c))
                ret.push({ url: r.url, chan: c });
        })
    );

    return ret;
}
module.exports.serverRules = serverRules;

function rmRule(url, chan) {
    let rules = getRules();
    for (let i = 0; i < rules.length; i++)
        if (rules[i].url == url) {
            rules[i].channels
                = rules[i].channels.filter(r => r != chan);
            break;
        }


    // remove rules which dont have any channels
    rules = rules.filter(r => !!r.channels.length);

    setRules(rules);
}

module.exports.rmRule = rmRule;
