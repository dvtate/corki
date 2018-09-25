

const logCmd = require("../logging.js");

module.exports = [

    { // -help general
        condition: msg => msg.content.match(/^help general(?:$|\s)/),
        act: async function (msg) {
            logCmd(msg, "asked for -help(general)");

            msg.channel.send({ embed: {
                color: 0x3498db,
                title: "General Commands Help",
                description: "For a complete list of commands, their help info, and more please visit [corki.js.org](https://corki.js.org/#commands)",

                fields: [
                    {
                        name: "`-coinflip`",
                        value: "sends the results of a fair coinflip (heads or tails)"
                    }, {
                        name: "`-commands`",
                        value: "view an outdated list of commands"
                    }, {
                        name: "`-echo <message>`",
                        value: "repeats given message"
                    }, {
                        name: "`-help`",
                        value: "view table of contents for help commands"
                    }, {
                        name: "-random <args>",
                        value: "RNG command, use `-help random` for more info"
                    }
                ],

                timestamp: "2018-05-27T20:04:50.607Z",

                footer: {
                    text: "Corki - corki.js.org"
                }

            }});
        }
    },

    { // -help fun
        condition: msg => msg.content.match(/^help fun(?:$|\s)/),
        act: async function (msg) {
            logCmd(msg, "asked for -help(fun)");

            msg.channel.send({ embed: {
                color: 0x3498db,
                title: "Fun Commands Help",
                description: "For a complete list of commands, their help info, and more please visit [corki.js.org](https://corki.js.org/#commands)",

                fields: [
                    {
                        name: "`-8ball [message]`",
                        value: "answers yes, no or maybe"
                    }, {
                        name: "`-roulette`",
                        value: "Mentions a random discord user. Great for giveaways. [[requires mod](https://corki.js.org/permissions.html)]"
                    }, {
                        name: "`-xkcd [comic#|latest]`",
                        value: "sends an xkcd comic strip\
\n + **no arguments:** sends random comic\
\n + **number:** sends a specific commic\
\n + **'latest':** sends the latest xkcd comic"
                    }
                ],

                timestamp: "2018-05-27T20:04:50.607Z",

                footer: {
                    text: "Corki - corki.js.org"
                }

            }});
        }
    },


    { // -help LoL
        condition: msg => msg.content.match(/^(?:help lol|lol help)(?:$|\s)/),
        act: async function (msg) {
            logCmd(msg, "asked for -help(lol))");

            msg.channel.send({ embed: {
                color: 0x3498db,
                title: "League of Legends Commands Help",
                description: "For a complete list of commands, their help info, and more please visit [corki.js.org](https://corki.js.org/#commands)",

                fields: [
                    {
                        name: "`-lol servers`",
                        value: "sends a list of the region/servers that corki supports"
                    }, {
                        name: "`-lol add <region> <summoner name>`",
                        value: "make corki associate the given League of Legends account with your discord account"
                    }, {
                        name: "`-lol leaderboard <championname>`",
                        value: "see a list of users with the most mastery points on the given champion in the server"
                    }, {
                        name: "`-lol list [@mention]`",
                        value: "list League accounts associated with you [or another user]"
                    }, {
                        name: "`-lol main <number>`",
                        value: "tell corki which account is your main account"
                    }, {
                        name: "`-lol masteries`",
                        value: "show your top 10 mastery champs"
                    }, {
                        name: "`-lol mastery <champname> [<@mention> | <region> <summoner name>]`",
                        value: "show how many mastery points you, a @mention'd user, or a specific summoner has on a champion (`-help lol mastery` for more)"
                    }, {
                        name: "`-lol mastery7`",
                        value: "list your mastery 7 champs"
                    }, {
                        name: "`-lol matchup [role] <champ1name> <champ2name>`",
                        value: "show matchup statistics for given champions"
                    }, {
                        name: "`-lol rank [<@mention> | <region> <summoner name>]`",
                        value: "show rank of you, a @mention'd user, or a specific summmoner"
                    }, {
                        name: "`-lol reset`",
                        value: "make corki unassociate all League of Legends accounts with your discord account"
                    }, {
                        name: "`-lol wr <champname>`",
                        value: "show average winrate for given champion"
                    }
                ],

                timestamp: "2018-06-24",

                footer: {
                    text: "Corki - corki.js.org"
                }

            }});
        }
    },


    { // -help international
        condition: msg => msg.content.match(/^help international(?:$|\s)/),
        act: async function (msg) {
            logCmd(msg, "asked for -help(international)");

            msg.channel.send({ embed: {
                color: 0x3498db,
                title: "International Commands Help",
                description: "For a complete list of commands, their help info, and more please visit [corki.js.org](https://corki.js.org/#commands)",

                fields: [
                    {
                        name: "`-exchange <quantity> <from> <to>`",
                        value: "convert a quantity of money from one [currency](https://oxr.readme.io/docs/supported-currencies) to another (see `-help exchange` for more)"
                    }, {
                        name: "`-timezone <timezone>`",
                        value: "check local time in given [timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List)/UTC offset (see `-help timezone` for more)"
                    }
                ],

                timestamp: "2018-05-27T20:04:50.607Z",

                footer: {
                    text: "Corki - corki.js.org"
                }

            }});
        }
    },

    { // -help server automation and management
        condition: msg => msg.content.match(/^help sam(?:$|\s)/),
        act: async function (msg) {
            logCmd(msg, "asked for -help(sam)");

            msg.channel.send({ embed: {
                color: 0x3498db,
                title: "Server Automation and Management Help",
                description: "For a complete list of commands, their help info, and more please visit [corki.js.org](https://corki.js.org/#commands)",

                fields: [
                    {
                        name: "`-add-sar <role(s)>`",
                        value: "Make a given role self-assignable [[requires mod](https://corki.js.org/permissions.html)]"
                    }, {
                        name: "`-reset-sar`",
                        value: "Stop all roles from being self-assignable [[requires mod](https://corki.js.org/permissions.html)]"
                    }, {
                        name: "`-iam <role(s)>`",
                        value: "Self assign server role(s)"
                    }, {
                        name: "`-iamnot <role(s)>`",
                        value: "Unassign role(s) to self (only works on SAR)"
                    }, {
                        name: "`-rss add <feed-url>`",
                        value: "forward all elements of an rss feed to this channel (see `-help rss` for more)",
                    }, {
                        name: "`-rss reset`",
                        value: "unsubscribe this channel from all rss feeds"
                    }, {
                        name: "`-prefix add <prefix>`",
                        value: "Make Corki accept commands starting with given prefix [[requires mod](https://corki.js.org/permissions.html)]"
                    }, {
                        name: "`-prefix set <prefix>`",
                        value: "Removes all prefixes then adds given prefix [[requires mod](https://corki.js.org/permissions.html)]"
                    }, {
                        name: "`-prefix list`",
                        value: "Show a list of prefixes available in given server if you (note: `@corki prefix list` cannot be disabled)"
                    }, {
                        name: "`-prefix reset`",
                        value: "resets command prefixes back to defaults (accept @mention or `-`) [[requires mod](https://corki.js.org/permissions.html)]"
                    }, {
                        name: "`-announce-new-members [template string]`",
                        value: "Every time a new member joins the server, corki will announce them in the channel this command is run in. \
The template string can be used to set the announcement text. (note keywords `{{member}}`, `{{membersCount}}`, and `{{server}}`)\n[[requires mod](https://corki.js.org/permissions.html)]`"
                    }, {
                        name: "`-ignore-new-members`",
                        value: "Remove new members announcements configured via `-announce-new-members` in the given channel. [[requires mod](https://corki.js.org/permissions.html)]"
                    }
                ],

                timestamp: "2018-05-27T20:04:50.607Z",

                footer: {
                    text: "Corki - corki.js.org"
                }

            }});
        }
    },

    { // -help text
        condition: msg => msg.content.match(/^help text(?:$|\s)/),
        act: async function (msg) {
            logCmd(msg, "asked for -help(text)");

            msg.channel.send({ embed: {
                color: 0x3498db,
                title: "Text Commands Help",
                description: "For a complete list of commands, their help info, and more please visit [corki.js.org](https://corki.js.org/#commands)",

                fields: [
                    {
                        name: "`-flip <text>`",
                        value: "rotate text 180 degrees"
                    }, {
                        name: "`-glitch <text>`",
                        value: "add glitchy characters to text"
                    }, {
                        name: "`-mirror <text>`",
                        value: "mirror text"
                    }, {
                        name: "`-spell <text>`",
                        value: "uses military phonetic alphabet to spell text"
                    }, {
                        name: "`-tinycaps <text>`",
                        value: "write text in tinycaps"
                    }, {
                        name: "`-vaporwave <text>`",
                        value: "write text in full width characters"
                    }
                ],

                timestamp: "2018-05-27T20:04:50.607Z",

                footer: {
                    text: "Corki - corki.js.org"
                }

            }});
        }
    },

    { // -help devtools
        condition: msg => msg.content.match(/^help devtools(?:$|\s)/),
        act: async function (msg) {
            logCmd(msg, "asked for -help(devtools)");

            msg.channel.send({ embed: {
                color: 0x3498db,
                title: "Developer Commands Help",
                description: "For a complete list of commands, their help info, and more please visit [corki.js.org](https://corki.js.org/#commands)",

                fields: [
                    {
                        name: "coming soon",
                        value: "Will probably be here tomorrow"
                    }
                ],

                timestamp: "2018-05-27T20:04:50.607Z",

                footer: {
                    text: "Corki - corki.js.org"
                }

            }});
        }
    },



    { // help overview (table of contents)
        condition: msg => msg.content.match(/^{?:h(?:elp)?|commands)(?:$|\s)|^$/),
        act: async function (msg) {
            logCmd(msg, "asked for -help");

            msg.channel.send({ embed : {
                color: 0x3498db,
                title: "Corki Bot Help",
                description: "For an up-to-date complete list of commands, their help info, and more please visit [corki.js.org](https://corki.js.org/#commands)",

                fields: [
                    {
                        name: "General Commands",
                        value: "Use `-help general` for help with general commands. These commands are fairly common and aren't very specialized."
                    }, {
                        name: "Fun Commands",
                        value: "Use `-help fun` for help with fun commands. These commands help make group chats more fun."
                    }, {
                        name: "League of Legends Commands",
                        value: "Use `help lol` for help with League commands. These commands are useful for League of Legends players."
                    }, {
                        name: "International Commands",
                        value: "Use `-help international` for help with international commands. These are useful for servers with memebers all around the world."
                    }, {
                        name: "Server Automation & Management",
                        value: "Use `-help sam` for help with server automation and management commands. These commands are useul for reducing the load on server mods and admins and can also add features to the server."
                    }, {
                        name: "Text Tools",
                        value: "Use `-help text` for help with text tools. These commands are useful for formatting text."
                    }, {
                        name: "Developer Tools",
                        value: "Use `-help devtools` for help with developer tools. These commands are useful for discord bot delevopers"
                    }
                ],


                timestamp: "2018-05-27T20:04:50.607Z",

                footer: {
                    text: "Corki - corki.js.org"
                }
            }});
        }

    }


];
