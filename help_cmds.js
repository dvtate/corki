

const logCmd = require("./logging.js");

module.exports = [
    { // help
        condition: function (msg) {
            return msg.content.match(/^-help/);
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

                timestamp: new Date(),

                footer: {
                    text: "Corki"
                }

            }});

        }
    },


];
