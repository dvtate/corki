
let rss = require("./rss_stuff.js");
const logCmd = require("../logging.js");
const mods = require("../sam/mods");

module.exports = [

    { // add a subscription to a channel
        condition: function (msg) {
            return msg.content.match(/^-rss (?:add|sub) (\S+)/);
        },
        act: async function (msg) {
            logCmd(msg, "added a -rss sub (-rss add)");

            if (!mods.isMod(msg.guild.id, msg.author.id)) {
                msg.channel.send("You must be given permission to run server \
management commands in order to perform this action. Ask an administrator to grant \
you these powers via https://corki.js.org/admin");
                return;
            }

            const url = this.condition(msg)[1];

            if (!url.match(/\:\/\//)) {
                msg.channel.send("Please include protocol in url. `https://` is optimal");
                return;
            }
            rss.testFeedUrl(url).then(() => {
                rss.addRule(msg.channel.id, url);
                msg.channel.send("Added an rss subscription to this channel, to stop rss subscriptions in this channel use `-rss reset`");
            }).catch(e => {
                msg.channel.send("That feed couldn't be accessed, make sure the url you gave is correct and contains a valid rss feed\n`" + e + "`");
            })
        }
    },

    {
        condition: function (msg) {
            return msg.content.match(/^-rss reset(?:$|\s)/);
        },
        act: async function (msg) {
            logCmd(msg, "unsubscribed to -rss feeds");

            if (!mods.isMod(msg.guild.id, msg.author.id)) {
                msg.channel.send("You must be given permission to run server \
management commands in order to perform this action. Ask an administrator to grant \
you these powers via https://corki.js.org/admin");
                return;
            }

            msg.channel.send(`Removed ${rss.removeChannel(msg.channel.id)} rss subscriptions from this channel`);
        }
    },

    {
        condition: msg => msg.content.match(/^-rss list/),
        act: async msg => {

            if (!mods.isMod(msg.guild.id, msg.author.id)) {
                msg.channel.send("You must be given permission to run server \
management commands in order to perform this action. Ask an administrator to grant \
you these powers via https://corki.js.org/admin");
                return;
            }

            // make the list of rules from rss.conf into a string
            let rules = rss.getRules()                      // get rules from file
                .filter(r => r.channel == msg.channel.id)   // take rules applicable to current channel
                    .map(r => r.url)                        // take the urls for said rules
                        .join(", ");                        // make a comma separated string of the urls

            msg.channel.send("This channel is subscribed to the following rss feeds: " + rules);

        }

    },


    { // -rss help
        condition: msg => msg.content.match(/^-(?:help rss|rss help|rss)(?:$|\s)/),
        act: async msg => msg.channel.send(rssHelpInfo)
    },


];

const rssHelpInfo = { embed : {
    title: "-rss help",
    description: "Corki bot can automatically forward all new updates from an RSS feed to this channel",
    fields: [
        {
            name: "Add a Subscription",
            value: "To add a subscription, use `-rss add <url>`"
        }, {
            name: "Remove Subscriptions",
            value: "To clear all subscriptions from a channel, use `-rss reset`"
        }, {
            name: "Example",
            value: `
lets assume we have a gaming related server and wanted a feed from (/r/gaming)[https://reddit.com/r/gaming]
\`-rss add https://reddit.com/r/gaming/new/.rss\`

we can continue to add more subscriptions and if it gets to be too much, we can remove our subscriptions via
\`-rss reset\``
        }
    ]
}};
