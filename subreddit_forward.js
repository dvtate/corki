


const request = require("request");
const fs = require("fs");

const logCmd = require("./logging.js");


const Parser = require("rss-parser");

// channels we send new reddit posts to
var channelList;

// date on most recent post
var recentDate = Date.now();


async function configure(){

    channelList = `${fs.readFileSync(`${process.env.HOME}/.corki/reddit/clist`)}`.split("\n");
    recentDate = Date.now();

}

module.exports.configure = configure;


// send story out to all channels
async function sendNewStories (item) {
    console.log("forwarding subreddit post");
    // post to relevant channels

    channelList.forEach(channel => {
        if (channel.length > 5)
            global.client.channels.find("id", channel).send(`${item.title} ${item.link}`);
        //global.client.channels[channel]
    });

}


async function loadFeed () {

    const tmpDate = Date.now(); // check date before waiting on loading

    const parser = new Parser();

    let feed = await parser.parseURL('https://www.reddit.com/r/corkimains/new/.rss');

    var latest = 0;
    feed.items.forEach(item => {

        if (Date.parse(item.pubDate) > recentDate) {
            sendNewStories(item);
            // update latest post time
            latest = Date.parse(item.pubDate) > latest ? Date.parse(item.pubDate) : latest;
        }
        //console.log(`[${item.pubDate}] ${Date.parse(item.pubDate)}::${recentDate}`);

    });

    recentDate = tmpDate;
}


// calls loadFeed every 10 mins
function refresh() {
    loadFeed();
    //console.log("checked subreddit");
    setTimeout(refresh, 10000);
}
setTimeout(refresh, 10000); // give 10 seconds for bot to start before checking


// used to make it so the bot posts subreddit posts to this channel
module.exports.command  = {

    condition: function (msg) {
        return msg.content.match(/^\-subreddit_link/);
    },

    act: async function (msg) {
        logCmd(msg, "linked subreddit to channel");
        msg.channel.send("linked subreddit to this channel");

        // add channel to list
        fs.appendFile(`${process.env.HOME}/.corki/reddit/clist`, msg.channel.id + '\n', err => {
            if (err)
                throw err;
        });

        // reconfigure
        configure();
    }
};
