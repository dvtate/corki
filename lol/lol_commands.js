const logCmd = require("../logging.js");

const teemo = require("./teemo.js");
const lol = require("./lol_stuff.js");

const lol_lb = require("./lol_leaderboard.js");
lol_lb.configure();



module.exports = [


    { // a specific summoner's mastery of a specific champ
        condition: msg => msg.content.match(/^-(?:mastery|lol mastery) (\S+) (\S+) (.+)/),
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
        condition: msg => msg.content.match(/^-(?:mastery|lol mastery) (\S+) <@!?([0-9]+)>/),
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
                msg.channel.send("They don't have any linked accounts. They should use `-lol add <region> <summonername>` to link their account(s)");
            });

        }
    },


    { // self mastery of a champ
        condition: msg => msg.content.match(/^-(?:mastery|lol mastery) (\S+)/),
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
                msg.channel.send("you don't have any linked accounts. you should use `-lol add <region> <summonername>` to link your account(s)");
            });
        }

    },

    { // -mastery help
        condition: msg => msg.content.match(/^-(?:mastery|lol mastery|help lol mastery)(?:$|\s)/),
        act: async function (msg) {
            logCmd(msg, "got help with `-lol mastery`");
            msg.channel.send(masteryHelpInfo);
        }
    },

    { // add acct
        condition: msg => msg.content.match(/^-lol add (\S+) (.+)/),
        act: async function (msg) {
            logCmd(msg, "linked an LoL acct (-add-lol)");

            const match = msg.content.match(/-lol add (\S+) (.+)/);
            const server = teemo.serverNames[match[1].toLowerCase()];
            if (!server) {
                msg.channel.send("Invalid/Missing region. Use `-lol servers` to see a list of regions");
                return;
            }
            const summoner = match[2];

            lol.addUserAcct(msg, server, summoner).then(() =>
                msg.channel.send(`${msg.author} is also ${summoner}`)
            ).catch(err =>
                msg.channel.send(`That didn't work. Check server and username\n\`\`\`\nerr: ${err}\n\`\`\``)
            );

        }

    },

    { // reset accounts list
        condition: msg => msg.content.match(/^-lol reset/),
        act: async function (msg) {
            logCmd(msg, "reset lol data (-lol reset)");
            lol.removeDir(msg.author.id);
            msg.channel.send("unlinked your accounts!");
        }

    },

    { // list another user's accts
        condition: msg => msg.content.match(/^-lol list <@!?([0-9]+)>/),
        act: async function (msg) {
            logCmd(msg, "listed a user's lol accts. (-list-lol)");


            const id = msg.content.match(/^-lol list <@!?([0-9]+)>/)[1];
            const userObj = lol.getUserData(id);

            if (!userObj) {
                msg.channel.send("They don't have any linked accounts. They should use `-lol add <region> <summonername>` to link their account(s)");
                return;
            }
            let str = `<@!${id}> has ${userObj.accounts.length} accounts:\n`;
            for (let i = 0; i < userObj.accounts.length; i++)
                str += `[${i}]: ${userObj.accounts[i].server} ${userObj.accounts[i].name}\n`;

            str += `main account: ${userObj.main}`;

            msg.channel.send(str);
        }
    },

    { // list accts
        condition: msg => msg.content.match(/^\-lol list/),
        act: async function (msg) {
            logCmd(msg, "listed lol accts. (-list-lol)")
            let userObj = lol.getUserData(msg.author.id);
            if (!userObj) {
                msg.channel.send("You don't have any linked accounts. use `-lol add <region> <summonername>` to link your account(s)");
                return;
            }
            let str = `${msg.author} has ${userObj.accounts.length} accounts:\n`;
            for (let i = 0; i < userObj.accounts.length; i++)
                str += `[${i}]: ${userObj.accounts[i].server} ${userObj.accounts[i].name}\n`;

            str += `main account: ${userObj.main}`;

            msg.channel.send(str);
        }
    },

    { // main acct
        condition: msg => msg.content.match(/^-lol main ([0-9])/),
        act: async function (msg) {
            logCmd(msg, "modified their main account");
            let userObj = lol.getUserData(msg.author.id);
            userObj.main = msg.content.match(/^-main-lol ([0-9])/)[1];
            lol.setUserData(msg.author.id, userObj);
            msg.channel.send("main account updated");
        }
    },

    {
        condition: msg => msg.content.match(/^-lol main/),
        act: async function (msg) {
            logCmd(msg, "checked their main -lol acct");
            let userObj = lol.getUserData(msg.author.id);
            msg.channel.send(`Your main account is ${userObj.accounts[userObj.main].server} ${userObj.accounts[userObj.main].name}
to change it use \`-lol main <account-number>\`, (account number can be fonud via \`-lol list\``);

        }
    },

    { // dev tool
        condition: msg => msg.content.match(/^-lol api ([\S\s]+)/),
        act: async function (msg) {
            logCmd(msg, "made a call to teemo.js");

            const args = msg.content.match(/^-lol api ([\S\s]+)/)[1].split(" ");
            teemo.riot.get.apply(teemo.riot, args)
                .then(data => msg.channel.send(JSON.stringify(data)))
                .catch(err => msg.channel.send(`err: ${err}`) );

        }
    },

    { // mastery leaderboard for server members
        condition: msg => msg.content.match(/^-lol (?:leaderboard|lb) (\S+)/),
        act: async function (msg) {
            let timer = process.hrtime();
            logCmd(msg, "generated leaderboard");

            const champName = msg.content.match(/^-lol (?:leaderboard|lb) (\S+)/)[1].replace(/\s/g, '');
            const champID = teemo.champIDs[champName.toLowerCase()];


            if (!champID) {
                msg.channel.send("invalid champion name (make sure to remove spaces)");
                return;
            }

            lol_lb.getLeaderBoard(msg.guild.members, champID).then(data => {
                msg.channel.send(`**${champName} Mastery Leaderboard:**\n` + lol_lb.formatLeaderBoard(data))

                let time = process.hrtime(timer);
                const ns_per_s = 1e9;
                time = (time[0] * ns_per_s + time[1]) / (ns_per_s)

                msg.channel.send(`that took ${time} seconds to complete`);
            });


        }
    },

    { // mastery leaderboard for all of the bot's users
        condition: msg => msg.content.match(/^-lol (?:global (?:leaderboard|lb)|glb) (\S+)/),
        act: function (msg) {

                let timer = process.hrtime();
                logCmd(msg, "generated leaderboard");

                const champName = msg.content.match(/^-lol (?:global (?:leaderboard|lb)|glb) (\S+)/)[1].replace(/\s/g, '');
                const champID = teemo.champIDs[champName.toLowerCase()];


                if (!champID) {
                    msg.channel.send("invalid champion name (make sure to remove spaces)");
                    return;
                }

                lol_lb.getLeaderBoard(msg.client.members, champID).then(data => {
                    msg.channel.send(`**${champName} Mastery Leaderboard:**\n` + lol_lb.formatLeaderBoard(data))

                    let time = process.hrtime(timer);
                    let ns_per_s = 1e9;
                    time = (time[0] * ns_per_s + time[1]) / (ns_per_s)

                    msg.channel.send(`that took ${time} seconds to complete`);
                });

        }

    },

    { // given summoner's rank
        condition: msg => msg.content.match(/^-lol rank (\S+) (.+)/),
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

    { // other user's rank
        condition: msg => msg.content.match(/^-lol rank <@!?([0-9]+)>/),
        act: async function (msg) {
            logCmd(msg, "checked a user's -lol rank");

            const id = msg.content.match(/^-lol rank <@!?([0-9]+)>/)[1];
            let userObj = lol.getUserData(id);

            if (!userObj) {
                msg.channel.send("They don't have any linked accounts. They should use `-lol add <region> <summonername>` to link their account(s)");
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

    { // self rank
        condition: msg => msg.content.match(/^-lol rank(?:$|\s)/),
        act: async function (msg) {
            logCmd(msg, "checked their -lol rank");
            let userObj = lol.getUserData(msg.author.id);

            if (!userObj) {
                msg.channel.send("You don't have any linked accounts. You should use `-lol add <region> <summonername>` to link your account(s)");
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
        condition: msg => msg.content.match(/^-lol servers(?:$|\s)/),
        act: async function (msg) {
            logCmd(msg, "asked for -lol servers");
            msg.channel.send("Corki supports LoL accounts on the following servers: "
                + Object.keys(teemo.serverNames).join(", "));
        }
    },


    { // champgg matchup
        condition: msg =>
            // -lol matchup <champ1> vs. <champ2> [elo]
            msg.content.match(/^-lol matchup (\S+) (?:vs?\.? )?(\S+)/),

        act: async function (msg) {
            logCmd(msg, "asked about a matchup");
            const match = msg.content.match(/^-lol matchup (\S+) (?:vs?\.? )?(\S+)/);

            const champ1id = teemo.champIDs[match[1].toLowerCase()];
            const champ2id = teemo.champIDs[match[2].toLowerCase()];

            if (!champ1id) {
                msg.channel.send(`Unknown champion ${match[1]}. Make sure spelling is correct and there are no spaces or special characters`);
                return;
            } if (!champ2id) {
                msg.channel.send(`Unknown champion ${match[2]}. Make sure spelling is correct and there are no spaces or special characters`);
                return;
            }
            //const elo = match[3] ? match[3].toUpperCase() : "PLATINUM,DIAMOND,MASTER,CHALLENGER";


            teemo.champgg.get("champion.getChampionMatchups", champ1id).then(data => {
                let foundMatchup = false;

                data.forEach(e => {
                    if (e.champ2_id == champ2id) {
                        foundMatchup = true;
                        msg.channel.send({ embed: {
                            title: `${match[1]} vs ${match[2]} as ${e.role.toLowerCase()}`,
                            description: `According to [champion.gg](https://champion.gg), ${match[1]} has a weighed score of ${Math.round(e.champ1.weighedScore)} and ${match[2]} has a weighedScore of ${Math.round(e.champ2.weighedScore)}.`,
                            fields: [
                                {
                                    name: "Income",
                                    value:
`**${match[1]}:** ${Math.round(e.champ1.goldEarned)} g, ${Math.round(e.champ1.minionsKilled)} cs, ${Math.round(e.champ1.neutralMinionsKilledTeamJungle)} jungle camps
**${match[2]}:** ${Math.round(e.champ2.goldEarned)} g, ${Math.round(e.champ2.minionsKilled)} cs, ${Math.round(e.champ2.neutralMinionsKilledTeamJungle)} jungle camps`
                                }, {
                                    name: "KDA",
                                    // todo add killingSpreees
                                    value:
`**${match[1]}:** ${Math.round(e.champ1.kills * 1000) / 1000} / ${Math.round(e.champ1.deaths * 1000) / 1000} / ${Math.round(e.champ1.assists * 1000) / 1000}
**${match[2]}:** ${Math.round(e.champ2.kills * 1000) / 1000} / ${Math.round(e.champ2.deaths * 1000) / 1000} / ${Math.round(e.champ2.assists * 1000) / 1000}`
                                }, {
                                    name: "Damage",
                                    value:
`**${match[1]}:** ${Math.round(e.champ1.totalDamageDealtToChampions)} damage dealt to champions
**${match[2]}:** ${Math.round(e.champ2.totalDamageDealtToChampions)} damage dealt to champions`
                                }, {
                                    name: "Winrates",
                                    value:
`**${match[1]}:** ${Math.round(e.champ1.winrate * 100 * 1000) / 1000}% winrate (${e.champ1.wins} wins)
**${match[2]}:** ${Math.round(e.champ2.winrate * 100 * 1000) / 1000}% winrate (${e.champ2.wins} wins)`
                                }

                            ]
                        }});
                    }
                });

                if (!foundMatchup && !msg.author.bot)
                    msg.channel.send(`-lol matchup ${match[2]} ${match[1]}`);
                else if (!foundMatchup)
                    msg.channel.send("not enough data for that matchup :/");

            }).catch(console.error);


        }
    },


    { // champgg matchup
        condition: msg =>
            // -lol matchup <role> <champ1> vs. <champ2> [elo]
            msg.content.match(/^-lol matchup (\S+) (\S+) (?:vs?\.? )?(\S+)/i),

        act: async function (msg) {
            logCmd(msg, "asked about a matchup");
            const match = msg.content.match(/^-lol matchup (\S+) (\S+) (?:vs?\.? )?(\S+)/);


            const roleNames = {
                "top" : "TOP",

                "mid" : "MIDDLE", "middle" : "MIDDLE",

                "jg" : "JUNGLE", "jungle" : "JUNGLE",
                "jng" : "JUNGLE", "jung" : "JUNGLE",

                "adc" : "DUO_CARRY", "bot" : "DUO_CARRY",
                "ad" : "DUO_CARRY", "carry" : "DUO_CARRY",
                "adcarry" : "DUO_CARRY",

                "sup" : "DUO_SUPPORT", "supp" : "DUO_SUPPORT",
                "support" : "DUO_SUPPORT", "realcarry" : "DUO_SUPPORT",
                "egirl" : "DUO_SUPPORT",

                "adcsupport" : "ADCSUPPORT", "adsupp" : "ADCSUPPORT",
                "synergy" : "SYNERGY"
            }


            const role = roleNames[match[1].toLowerCase()];

            if (!role) {
                msg.channel.send("invalid role please use: top, mid, jg, adc, or supp (or any other champgg role)");
            }

            const champ1id = teemo.champIDs[match[2].toLowerCase()];
            const champ2id = teemo.champIDs[match[3].toLowerCase()];

            if (!champ1id) {
                msg.channel.send(`Unknown champion ${match[1]}. Make sure spelling is correct and there are no spaces or special characters`);
                return;
            } if (!champ2id) {
                msg.channel.send(`Unknown champion ${match[2]}. Make sure spelling is correct and there are no spaces or special characters`);
                return;
            }

            //const elo = match[3] ? match[3].toUpperCase() : "PLATINUM,DIAMOND,MASTER,CHALLENGER";


            teemo.champgg.get("champion.getChampionMatchupsByRole", champ1id, role).then(data => {

                let foundMatchup = false;

                data.forEach(e => {
                    if (e._id.champ2_id == champ2id) {
                        foundMatchup = true;
                        msg.channel.send({ embed: {
                            title: `${match[2]} vs ${match[3]} as ${e.role.toLowerCase()}`,
                            description: `According to [champion.gg](https://champion.gg), ${match[2]} has a weighed score of ${Math.round(e.champ1.weighedScore)} and ${match[3]} has a weighedScore of ${Math.round(e.champ2.weighedScore)}.`,
                            fields: [
                                {
                                    name: "Income",
                                    value:
`**${match[2]}:** ${Math.round(e.champ1.goldEarned)} g, ${Math.round(e.champ1.minionsKilled)} cs, ${Math.round(e.champ1.neutralMinionsKilledTeamJungle)} jungle camps
**${match[3]}:** ${Math.round(e.champ2.goldEarned)} g, ${Math.round(e.champ2.minionsKilled)} cs, ${Math.round(e.champ2.neutralMinionsKilledTeamJungle)} jungle camps`
                                }, {
                                    name: "KDA",
                                    // todo add killingSpreees
                                    value:
`**${match[2]}:** ${Math.round(e.champ1.kills * 1000) / 1000} / ${Math.round(e.champ1.deaths * 1000) / 1000} / ${Math.round(e.champ1.assists * 1000) / 1000}
**${match[3]}:** ${Math.round(e.champ2.kills * 1000) / 1000} / ${Math.round(e.champ2.deaths * 1000) / 1000} / ${Math.round(e.champ2.assists * 1000) / 1000}`

                                }, {
                                    name: "Damage",
                                    value:
`**${match[2]}:** ${Math.round(e.champ1.totalDamageDealtToChampions)} damage dealt to champions
**${match[3]}:** ${Math.round(e.champ2.totalDamageDealtToChampions)} damage dealt to champions`

                                }, {
                                    name: "Winrates",
                                    value:
`**${match[2]}:** ${Math.round(e.champ1.winrate * 100 * 1000) / 1000}% winrate (${e.champ1.wins} wins)
**${match[3]}:** ${Math.round(e.champ2.winrate * 100 * 1000) / 1000}% winrate (${e.champ2.wins} wins)`
                                }
                            ]
                        }});
                    }


                });


                if (!foundMatchup && !msg.author.bot)
                    msg.channel.send(`-lol matchup ${match[1]} ${match[3]} ${match[2]}`);
                else if (!foundMatchup)
                    msg.channel.send("not enough data for that matchup :/");

            }).catch(console.error);

        }
    },

    { // champgg winrate
        condition: msg => msg.content.match(/^-lol wr (\S+)/),
        act: async function (msg) {
            const champName = msg.content.match(/^-lol wr (\S+)/)[1];
            const champ = teemo.champIDs[champName.toLowerCase()];
            if (!champ) {
                msg.channel.send(`Unknown champion ${champName}. Make sure spelling is correct and there are no spaces or special characters`);
                return;
            }

            teemo.champgg.get('champion.getChampion', champ).then(data =>
                data.forEach(d =>
                    msg.channel.send(`${champName} ${d.role.trim().toLowerCase()} has a winrate of ${Math.round(d.winRate * 10000) / 100}`)
                )
            );
        }
    },

    { // convert champ name/id
        condition: msg => msg.content.match(/^-lol c (\S+)/),
        act: async function (msg) {
            logCmd(msg, "got a champ name/id (-lol c)");
            msg.channel.send(teemo.champs[msg.content.match(/^-lol c (\S+)/)[1].toLowerCase()]);
        }
    },

    {
        condition: msg => msg.content.match(/^-lol masteries(?:$|\s)/),
        act: async msg => {
            logCmd(msg, "got mastery info");

            let userObj = lol.getUserData(msg.author.id);

            if (!userObj) {
                msg.channel.send("You don't have any linked accounts. You should use `-lol add <region> <summonername>` to link your account(s)");
                return;
            }

            let main = userObj.accounts[userObj.main];

            let score = await teemo.riot.get(main.server, "championMastery.getChampionMasteryScore", main.id);

            teemo.riot.get(main.server, "championMastery.getAllChampionMasteries", main.id).then(data => {
                let totalPoints = 0;
                data.forEach(c => totalPoints += c.championPoints);

                let summary = { embed: {
                    title: "Champion Mastery Summary",
                    description: `${msg.author.username} has aquired ${totalPoints} mastery points their main account ${main.name}, which has a mastery score of ${score}`,
                    fields: []
                }};

                for (let i = 0; i < 10 && i < data.length; i++)
                    summary.embed.fields.push({
                        name: teemo.champs[data[i].championId],
                        value: `mastery level: ${data[i].championLevel}, ${data[i].championPoints} points
chest: ${data[i].chestGranted}${
    data[i].championLevel == 7 || data[i].championLevel < 5 ? ""
    : "\ntokens: " + data[i].tokensEarned}
last played: ${Date(data[i].lastPlayTime)}`
                    });

                msg.channel.send(summary);
            });


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
