

const fs = require("fs");

const Parser = require("rss-parser");

const logCmd = require("../logging.js");



/*
// list of rss rules
rss-data: [
    // all data associated with rss rule
    rule: {
        channel: channel-id,
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

function setRules(rules) {
    fs.writeFileSync(`${process.env.HOME}/.corki/rss.conf`, JSON.stringify(rules));
}

function addRule(channelID, url) {
    let rules = getRules();
    rules.push({
        channel: channelID,
        url: url,
        latest: 0
    });
    setRules(rules);
}

module.exports.addRule = addRule;

function removeChannel(channelID) {
    let rules = getRules();

}





async function sendItems(items, channel) {
    // nothing to send
    if (items.length == 0)
        return;

    console.log("forwarding rss update(s)");

    try {
        const chan = global.client.channels.get(channel);
        items.forEach(e => chan.send(`${e.title} ${e.link}`));
    } catch (e) {

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


function checkFeeds() {
    let rules = getRules();

    // make an array full of promises of new rss elements
    let requests = rules.map(r =>
        processRule(r).catch(e => {
            console.error(e.Error);
            return { items : [], rule : r };
        })
    );

    // make request
    Promise.all(requests).then(results => {
        for (let i = 0; i < results.length; i++) {
            rules[i] = results[i].rule;
            console.log(results[i].rule);
            sendItems(results[i].items, results[i].rule.channel);
        }

        setRules(rules);
    });
}


// checks for posts every 30s
function refresh() {
    checkFeeds();
    setTimeout(refresh, 15000); // every 20 seconds
}
setTimeout(refresh, 10000); // give 20 seconds for bot to start before checking
