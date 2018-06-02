

const logCmd = require("./logging.js");

module.exports = [

    { // -help general
        condition: function (msg) {
            return msg.content.match(/^-help general(?:$|\s)/);
        },
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
        condition: function (msg) {
            return msg.content.match(/^-help fun(?:$|\s)/);
        },
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
        condition: function (msg) {
            return msg.content.match(/^-(?:help lol|lol help)(?:$|\s)/);
        },
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
                        name: "`-lol mastery <champname> [<@mention> | <region> <summoner name>]`",
                        value: "show how many mastery points you, a @mention'd user, or a specific summoner has on a champion (`-help lol mastery` for more)"
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

                timestamp: "2018-05-27T20:04:50.607Z",

                footer: {
                    text: "Corki - corki.js.org"
                }

            }});
        }
    },


    { // -help international
        condition: function (msg) {
            return msg.content.match(/^-help international(?:$|\s)/);
        },
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
        condition: function (msg) {
            return msg.content.match(/^-help sam(?:$|\s)/);
        },
        act: async function (msg) {
            logCmd(msg, "asked for -help(sam)");

            msg.channel.send({ embed: {
                color: 0x3498db,
                title: "Server Automation and Management Help",
                description: "For a complete list of commands, their help info, and more please visit [corki.js.org](https://corki.js.org/#commands)",

                fields: [
                    {
                        name: "`-add-assignable-role <role(s)`",
                        value: "add a role that users in the server can self-assign [requires MANAGE_ROLES priveleges]"
                    }, {
                        name: "`-iam <role(s)>`",
                        value: "self assign server role(s)"
                    }, {
                        name: "`-iamnot <role(s)>`",
                        value: "unassign role(s) to self"
                    }, {
                        name: "`-subreddit-link`",
                        value: "begin forwarding all new posts to [/r/corkimains](https://reddit.com/r/corkimains) here"
                    }, {
                        name: "`-subreddit-unlink`",
                        value: "stop forwarding subreddit posts here"
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
        condition: function (msg) {
            return msg.content.match(/^-help text(?:$|\s)/);
        },
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
        condition: function (msg) {
            return msg.content.match(/^-help devtools(?:$|\s)/);
        },
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
        condition: function (msg) {
            return msg.content.match(/^-help(?:$|\s)/);
        },
        act: async function (msg) {
            logCmd(msg, "asked for -help");

            msg.channel.send({ embed : {
                color: 0x3498db,
                title: "Corki Bot Help",
                description: "For a complete list of commands, their help info, and more please visit [corki.js.org](https://corki.js.org/#commands)",

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

    },

    { // commands list (depricated)
        condition: function (msg) {
            return msg.content.match(/^-commands/);
        },
        act: async function (msg) {

            logCmd(msg, "asked for -commands");

            msg.channel.send({ embed: {
                color: 0x3498db,
                title: "Corki Bot Commands list",
                description: "If you don't know how to format arguments to a command try running it without them. For better list see [corki.js.org](https://corki.js.org/#commands)",


                fields: [
                    {
                        name: "General Commands",
                        value: `
\`-help\`: access this message.
\`-8ball [question]\`: answers yes, no, or maybe.
\`-echo <quote>\`: repeats <quote>.
\`-coinflip\`: sends heads or tails.
\`-random <args>\`: sends random number.
\`-xkcd [comic#|latest]\`: sends XKCD comic.
                        `
                    }, {
                        name: "League of Legends related commands",
                        value: `
\`-lol add <region-code> <summoner-name>\`: link your LoL acct to your discord account.
\`-lol list\`: list the League of legends accounts linked to your discord account.
\`-lol main <account-number>\`: set an account as your main (use index from \`-lol list\`)
\`-lol mastery <args>\`: champion mastery information (run \`-lol mastery\` for help)
\`-lol reset\`: remove all linked accounts
\`-lol leaderboard <champion>\`: gives mastery points leaderboard for server`
                    }, {
                        name: "International Commands",
                        value: `
\`-exchange <amount> <from> <to>\`: convert between currencies.
\`-timezone <unix-tz>\`: gives local time in given unix timezone.`
                    }, {
                        name: "Server Roles",
                        value: `
\`-iam <role(s)>\`: give yourself a role (use commas to assign multiple at once).
\`-iamnot <role(s)>\`: remove role from self.
\`-add-assignable-role <role(s)>\`: mark given as self-assignable [admin]`
                    }, {
                        name: "Text Commands",
                        value: `
\`-spell <word>\`: spells word using military phonetic alphabet.
\`-vaporwave <text>\`: formats text to vaporwave (full-width).
\`-glitch <text>\`: add characters to make text glitchy.
\`-flip <text>\`: flip text upside-down.
\`-tinycaps <text>\`: switch letters for small caps.
\`-mirror <text>\`: reverse text and characters.`
                    }, {
                        name: "Developer Commands:",
                        value: `
\`-log <args>\`: get/send useful info. (send \`-log help\` for more)
\`-ping\`: test a connection.
\`-msg <channel> <message>\`: send a message to a given channel. [admin]
\`-bug <description>\`: send a bug report (or better yet, [GitHub](https://github.com/dvtate/corki-bot))
\`-system <command>\`: run shell command on host server. [admin]
\`-eval <node.js code>\`: run node.js code as the act of a command. [admin]`
                    }, {


                        name: "Other Commands",
                        value: `
\`-subreddit-link\`: forward all new posts from [/r/corkimains](https://reddit.com/r/corkimains) here
\`-subreddit-unlink\`: stop forwarding reddit posts here`
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
