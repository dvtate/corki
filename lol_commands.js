const logCmd = require("./logging.js");

const teemo = require("./teemo.js");
const lol = require("./lol_stuff.js");

const lol_lb = require("./lol_leaderboard.js");
lol_lb.configure();



module.exports = [


    { // a specific summoner's mastery of a specific champ
        condition: function (msg) {
            return msg.content.match(/^-(?:mastery|lol mastery) (\S+) (\S+) (.+)/)
        },
        act: async function (msg) {
            const match = msg.content.match(/^\-(?:mastery|lol mastery) (\S+) (\S+) (.+)/);

            const champ = teemo.champIDs[match[1].toLowerCase()];
            const server = teemo.serverNames[match[2].toLowerCase()];

            if (!champ) {
                msg.channel.send("invalid champion (run `-lol mastery help` for more)");
                return;
            }
            if (!server) {
                msg.channel.send("invalid server (run `-lol mastery help` for more)");
                return;
            }

            // get summoner id
            teemo.riot.get(server, "summoner.getBySummonerName", match[3]).then(summoner => {
                // get champ mastery
                teemo.riot.get(server, "championMastery.getChampionMastery", summoner.id, champ).then(data => {
                    // send mastery to channel
                    if (!data)
                        msg.channel.send(`${summoner.name} has never played ${match[1].toLowerCase()}`);
                    else
                        msg.channel.send(`${summoner.name} has mastery level ${data.championLevel} with ${data.championPoints} points on ${match[1].toLowerCase()}`);
                });

            }).catch(err => {
                msg.channel.send(`${match[3]} wasn't found on ${match[2]} (run \`-lol mastery help\` for more)`);
            });
        }
    },

    { // mastery of a different user
        condition: function (msg) {
            return msg.content.match(/^-(?:mastery|lol mastery) (\S+) <@!?([0-9]+)>/);
        },
        act: async function (msg) {
            const match = msg.content.match(/^-(?:mastery|lol mastery) (\S+) <@!?([0-9]+)>/);
            const champName = match[1].toLowerCase();
            const champID = teemo.champIDs[champName];
            const id = match[2];

            if (!champID) {
                msg.channel.send("invalid champion (run `-lol mastery help` for more)");
                return;
            }

            lol.getUserMastery(id, champID).then(pts => {
                msg.channel.send(`<@!${id}> has ${pts} points on ${champName}`);
            }).catch(err => {
                msg.channel.send("They don't have any linked accounts. They should use `-lol add` to link their account(s)");
            });

        }
    },

    { // -mastery help
        condition: function (msg) {
            return msg.content.match(/^-(?:mastery|lol mastery) help/);
        },
        act: async function (msg) {
            logCmd(msg, "got help with `-lol mastery`");
            msg.channel.send(masteryHelpInfo);
        }
    },

    { // self mastery of a champ
        condition: function (msg) {
            return msg.content.match(/^-(?:mastery|lol mastery) (\S+)/)
        },
        act: async function (msg) {
            const champName = msg.content.match(/^-(?:mastery|lol mastery) (\S+)/)[1].toLowerCase();
            const champID =  teemo.champIDs[champName];

            if (!champID) {
                msg.channel.send("invalid champion (run `-lol mastery help` for more)");
                return;
            }

            lol.getUserMastery(msg.author.id, champID).then(pts => {
                msg.channel.send(`You have ${pts} points on ${champName}`);
            }).catch(err => {
                msg.channel.send("you don't have any linked accounts. you should use `-lol add` to link your account(s)");
            });
        }

    },

    { // -mastery help
        condition: function (msg) {
            return msg.content.match(/^-(?:mastery|lol mastery|help lol mastery)(?:$|\s)/);
        },
        act: async function (msg) {
            logCmd(msg, "got help with `-lol mastery`");
            msg.channel.send(masteryHelpInfo);
        }
    },

    { // add acct
        condition: function (msg) {
            return msg.content.match(/^-lol add (\S+) (.+)/);
        },
        act: async function (msg) {
            logCmd(msg, "linked an LoL acct (-add-lol)");

            const match = msg.content.match(/-lol add (\S+) (.+)/);
            const server = teemo.serverNames[match[1].toLowerCase()];
            const summoner = match[2];

            lol.addUserAcct(msg, server, summoner).then(() =>
                msg.channel.send(`${msg.author} is also ${summoner}`)
            ).catch(err =>
                msg.channel.send(`That didn't work. Check server and username\n\`\`\`\nerr: ${err}\n\`\`\``)
            );

        }

    },

    { // reset accounts list
        condition: function (msg) {
            return msg.content.match(/^-lol reset/);
        },
        act: async function (msg) {
            logCmd(msg, "reset lol data (-lol reset)");
            lol.removeDir(msg.author.id);
            msg.channel.send("unlinked your accounts!");
        }

    },

    { // list another user's accts
        condition: function (msg) {
            return msg.content.match(/^-lol list <@!?([0-9]+)>/);
        },
        act: async function (msg) {
            logCmd(msg, "listed a user's lol accts. (-list-lol)");


            const id = msg.content.match(/^-lol list <@!?([0-9]+)>/)[1];
            const userObj = lol.getUserData(id);

            if (!userObj) {
                msg.channel.send("They don't have any linked accounts. They should use `-lol add` to link their account(s)");
                return;
            }
            var str = `<@!${id}> has ${userObj.accounts.length} accounts:\n`;
            for (let i = 0; i < userObj.accounts.length; i++)
                str += `[${i}]: ${userObj.accounts[i].server} ${userObj.accounts[i].name}\n`;

            str += `main account: ${userObj.main}`;

            msg.channel.send(str);
        }
    },

    { // list accts
        condition: function (msg) {
            return msg.content.match(/^\-lol list/);
        },
        act: async function (msg) {
            logCmd(msg, "listed lol accts. (-list-lol)")
            var userObj = lol.getUserData(msg.author.id);
            if (!userObj) {
                msg.channel.send("You don't have any linked accounts. use `-lol add` to link your account(s)");
                return;
            }
            var str = `${msg.author} has ${userObj.accounts.length} accounts:\n`;
            for (let i = 0; i < userObj.accounts.length; i++)
                str += `[${i}]: ${userObj.accounts[i].server} ${userObj.accounts[i].name}\n`;

            str += `main account: ${userObj.main}`;

            msg.channel.send(str);
        }
    },

    { // main acct
        condition: function (msg) {
            return msg.content.match(/^-lol main ([0-9])/);
        },
        act: async function (msg) {
            logCmd(msg, "modified their main account");
            var userObj = lol.getUserData(msg.author.id);
            userObj.main = msg.content.match(/^-main-lol ([0-9])/)[1];
            lol.setUserData(msg.author.id, userObj);
            msg.channel.send("main account updated");
        }
    },

    {
        condition: function (msg) {
            return msg.content.match(/^-lol api ([\S\s]+)/);
        },
        act: async function (msg) {
            logCmd(msg, "made a call to teemo.js");

            const args = msg.content.match(/^-lol api ([\S\s]+)/)[1].split(" ");
            teemo.riot.get.apply(teemo.riot, args)
                .then(data => msg.channel.send(JSON.stringify(data)))
                .catch(err => msg.channel.send(`err: ${err}`) );

        }
    },

    {
        condition: function (msg) {
            return msg.content.match(/^-lol (?:leaderboard|lb) (\S+)/);
        },
        act: async function (msg) {
            logCmd(msg, "generated leaderboard");

            const champName = msg.content.match(/^-lol leaderboard (\S+)/)[1].replace(/\s/g, '');
            const champID = teemo.champIDs[champName.toLowerCase()];


            if (!champID) {
                msg.channel.send("invalid champion name (make sure to remove spaces)");
                return;
            }

            lol_lb.getLeaderBoard(msg.guild.members, champID).then(data =>
                msg.channel.send(`**${champName} Mastery Leaderboard:**\n` + lol_lb.formatLeaderBoard(data)));


        }
    },

    {
        condition: function (msg) {
            return msg.content.match(/^-lol rank (\S+) (.+)/);
        },
        act: async function (msg) {
            logCmd(msg, "checked an account's -lol rank");

            const match = msg.content.match(/^-lol rank (\S+) (.+)/);
            const server = teemo.serverNames[match[1].toLowerCase()];

            if (!server) {
                msg.channel.send("invalid server (run `-lol servers` for more)");
                return;
            }


            // get summoner id
            teemo.riot.get(server, "summoner.getBySummonerName", match[2]).then(summoner => {
                teemo.riot.get(server, "league.getAllLeaguePositionsForSummoner", summoner.id).then(rank => {
                    lol.makeRankSummary(summoner.name, summoner.name, rank)
                        .then(summary => msg.channel.send(summary)).catch(console.error)

                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                console.log(err);
                msg.channel.send(`${match[2]} wasn't found on ${match[1]} (run \`-lol servers\` for more)`);
            });


        }
    },

    {
        condition: function (msg) {
            return msg.content.match(/^-lol rank <@!?([0-9]+)>/);
        },
        act: async function (msg) {
            logCmd(msg, "checked a user's -lol rank");

            const id = msg.content.match(/^-lol rank <@!?([0-9]+)>/)[1];
            let userObj = lol.getUserData(id);

            if (!userObj) {
                msg.channel.send("They don't have any linked accounts. They should use `-lol add` to link their account(s)");
                return;
            }

            let main = userObj.accounts[userObj.main];

            teemo.riot.get(main.server, "league.getAllLeaguePositionsForSummoner", main.id).then(rank => {
                lol.makeRankSummary(msg.client.users.get(id).username, main.name, rank)
                    .then(summary => msg.channel.send(summary)).catch(console.error)
            }).catch(err => {
                console.log(err);
            });
        }
    },

    {
        condition: function (msg) {
            return msg.content.match(/^-lol rank(?:$|\s)/);
        },
        act: async function (msg) {
            logCmd(msg, "checked their -lol rank");
            let userObj = lol.getUserData(msg.author.id);

            if (!userObj) {
                msg.channel.send("They don't have any linked accounts. They should use `-lol add` to link their account(s)");
                return;
            }

            let main = userObj.accounts[userObj.main];

            teemo.riot.get(main.server, "league.getAllLeaguePositionsForSummoner", main.id).then(rank => {
                lol.makeRankSummary(msg.client.users.get(msg.author.id).username, main.name, rank)
                    .then(summary => msg.channel.send(summary)).catch(console.error)
            }).catch(err => {
                console.log(err);
            });

        }
    },

    { // list supported server names
        condition: function (msg) {
            return msg.content.match(/^-lol servers(?:$|\s)/);
        },
        act: async function (msg) {
            logCmd(msg, "asked for -lol servers");
            msg.channel.send("Corki supports LoL accounts on the following servers: "
                + Object.keys(teemo.serverNames).join(", "));
        }
    }

];


const masteryHelpInfo = { embed: {
    title: "-mastery information",
    description: "There are a variety of tools for checking your mastery points on a champion. Note champion names and usernames should omit spaces",
    fields: [
        {
            name: "Argument format",
            value: `There are 3 possible forms for arguments:
\`-lol mastery <championname>\`: show your mastery of a specific champion
\`-lol mastery <champtionname> @userMention\`: show another user's mastery of a specific champion
\`-lol mastery <championname> <server> <summonername>\`: show a summoners mastery of a champion`
        }, {
            name: "examples",
            value: `
\`-lol mastery missfortune\`: show my points on Miss Fortune
\`-lol mastery drmundo @testuser\`: show [@testuser]()'s points on Dr. Mundo
\`-lol mastery zed kr hideonbush\`: show faker's points on zed`
        }

    ]

}}
