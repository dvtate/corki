
let rss = require("./rss_stuff.js");
const logCmd = require("../logging.js");

module.exports = [

    {
        condition: function (msg) {
            return msg.content.match(/^-rss add (\S+)/);
        },
        act: async function (msg) {
            logCmd(msg, "added a -rss sub (-rss add)");
            const url = msg.content.match(/^-rss add (\S+)/)[1];
            rss.addRule(msg.channel.id, url);
            msg.channel.send("Added an rss subscription to this channel, to stop rss subscriptions in this channel use `-rss reset`");
        }
    }

];
