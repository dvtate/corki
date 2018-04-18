


const request = require("request");
const fs = require("fs");

const logCmd = require("./logging.js");


const Parser = require("rss-parser");
const parser = new Parser();

// channels we send new reddit posts to
var channelList;

// date on most recent post
var recentDate;


async function configure(){

    channelList = `${fs.readFileSync(`${process.env.HOME}/.corki/reddit/clist`)}`.split("\n");
    recentDate = fs.readFileSync(`${process.env.HOME}/.corki/reddit/rdate`);

    if (recentDate.length == 0)
        fs.writeFile(`${process.env.HOME}/.corki/reddit/rdate`, Date.now(), error => {
            if (error)
                throw error;
        });

}

module.exports.configure = configure;

async function loadFeed () {


    let feed = await parser.parseURL('https://www.reddit.com/r/leagueoflegends/new/.rss');

    feed.items.forEach(item => {

        if (Date.parse(item.pubDate) > recentDate)
            sendNewStories(item);
        //console.log(item.title + ':' + item.link);

    });
}

// send story out to all channels
async function sendNewStories (item) {
    console.log("forwarding subreddit post");
    // post to relevant channels

    channelList.forEach(channel => {
        if (channel.length > 5)
            global.client.channels.find("id", channel).send(`${item.title} ${item.link}`);
        //global.client.channels[channel]
    });

    // prevent same story from being sent multiple times
    recentDate = Date.parse(item.date);
    fs.writeFile(`${process.env.HOME}/.corki/reddit/rdate`, Date.now(), err => {
        if (err) throw err;
    });

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

    act: function (msg) {
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
