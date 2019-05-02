const fs = require("fs");

const logCmd = require("../logging.js");

const teemo = require("./teemo.js");


module.exports = [
    { // champgg matchup
        condition: msg =>
            // -lol matchup <champ1> vs. <champ2> [elo]
            msg.content.match(/^lol matchup (\S+) (?:vs?\.? |and |\& |\+ )?(\S+)$/),

        act: async function (msg) {
            logCmd(msg, "asked about a matchup");
            const match = this.condition(msg);

            const champ1id = teemo.champIDs[match[1].toLowerCase().trim()];
            const champ2id = teemo.champIDs[match[2].toLowerCase().trim()];

            if (!champ1id) {
                msg.channel.send(`Unknown champion ${match[1].toLowerCase().trim()}. Make sure spelling is correct and there are no spaces or special characters`);
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
                            title: `${teemo.champs[champ1id]} vs ${teemo.champs[champ2id]} as ${e.role.toLowerCase()}`,
                            description: `According to [champion.gg](https://champion.gg), ${teemo.champs[champ1id]} has a weighed score of ${Math.round(e.champ1.weighedScore)} and ${teemo.champs[champ2id]} has a weighedScore of ${Math.round(e.champ2.weighedScore)}.`,
                            fields: [
                                {
                                    name: "Income",
                                    value:
`**${teemo.champs[champ1id]}:** ${Math.round(e.champ1.goldEarned)} g, ${Math.round(e.champ1.minionsKilled)} cs, ${Math.round(e.champ1.neutralMinionsKilledTeamJungle)} jungle camps
**${teemo.champs[champ2id]}:** ${Math.round(e.champ2.goldEarned)} g, ${Math.round(e.champ2.minionsKilled)} cs, ${Math.round(e.champ2.neutralMinionsKilledTeamJungle)} jungle camps`
                                }, {
                                    name: "KDA",
                                    // todo add killingSpreees
                                    value:
`**${teemo.champs[champ1id]}:** ${Math.round(e.champ1.kills * 1000) / 1000} / ${Math.round(e.champ1.deaths * 1000) / 1000} / ${Math.round(e.champ1.assists * 1000) / 1000}
**${teemo.champs[champ2id]}:** ${Math.round(e.champ2.kills * 1000) / 1000} / ${Math.round(e.champ2.deaths * 1000) / 1000} / ${Math.round(e.champ2.assists * 1000) / 1000}`
                                }, {
                                    name: "Damage",
                                    value:
`**${teemo.champs[champ1id]}:** ${Math.round(e.champ1.totalDamageDealtToChampions)} damage dealt to champions
**${teemo.champs[champ2id]}:** ${Math.round(e.champ2.totalDamageDealtToChampions)} damage dealt to champions`
                                }, {
                                    name: "Winrates",
                                    value:
`**${teemo.champs[champ1id]}:** ${Math.round(e.champ1.winrate * 100 * 1000) / 1000}% winrate (${e.champ1.wins} wins)
**${teemo.champs[champ2id]}:** ${Math.round(e.champ2.winrate * 100 * 1000) / 1000}% winrate (${e.champ2.wins} wins)`
                                }
                            ]
                        }});
                    }
                });

                if (!foundMatchup && !msg.author.bot)
                    msg.channel.send(`${global.client.user} lol matchup ${match[2]} ${match[1]}`);
                else if (!foundMatchup)
                    msg.channel.send("not enough data in plat+ for that matchup :/");

            }).catch(e => {
                msg.channel.send("champion.gg api appears to be having issues.");
                console.error(e);
                throw e;
            });


        },
        tests: ["-lol matchup brand anivia", "-lol matchup janna + twitch", "-lol matchup nasus vs. riven "]
    },

    { // champgg matchup
        condition: msg =>
            // -lol matchup <role> <champ1> vs. <champ2> [elo]
            msg.content.match(/^lol matchup (\S+) (\S+) (?:vs?\.? |and |\& |\+ )?(\S+)/i),

        act: async function (msg) {
            logCmd(msg, "asked about a matchup");
            const match = this.condition(msg);


            const role = teemo.champggRoleNames[match[1].toLowerCase()];

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
                            title: `${teemo.champs[champ1id]} vs ${teemo.champs[champ2id]} as ${e.role.toLowerCase()}`,
                            description: `According to [champion.gg](https://champion.gg), ${teemo.champs[champ1id]} has a weighed score of ${Math.round(e.champ1.weighedScore)} and ${teemo.champs[champ2id]} has a weighedScore of ${Math.round(e.champ2.weighedScore)}.`,
                            fields: [
                                {
                                    name: "Income",
                                    value:
`**${teemo.champs[champ1id]}:** ${Math.round(e.champ1.goldEarned)} g, ${Math.round(e.champ1.minionsKilled)} cs, ${Math.round(e.champ1.neutralMinionsKilledTeamJungle)} jungle camps
**${teemo.champs[champ2id]}:** ${Math.round(e.champ2.goldEarned)} g, ${Math.round(e.champ2.minionsKilled)} cs, ${Math.round(e.champ2.neutralMinionsKilledTeamJungle)} jungle camps`
                                }, {
                                    name: "KDA",
                                    // todo add killingSpreees
                                    value:
`**${teemo.champs[champ1id]}:** ${Math.round(e.champ1.kills * 1000) / 1000} / ${Math.round(e.champ1.deaths * 1000) / 1000} / ${Math.round(e.champ1.assists * 1000) / 1000}
**${teemo.champs[champ2id]}:** ${Math.round(e.champ2.kills * 1000) / 1000} / ${Math.round(e.champ2.deaths * 1000) / 1000} / ${Math.round(e.champ2.assists * 1000) / 1000}`

                                }, {
                                    name: "Damage",
                                    value:
`**${teemo.champs[champ1id]}:** ${Math.round(e.champ1.totalDamageDealtToChampions)} damage dealt to champions
**${teemo.champs[champ2id]}:** ${Math.round(e.champ2.totalDamageDealtToChampions)} damage dealt to champions`

                                }, {
                                    name: "Winrates",
                                    value:
`**${teemo.champs[champ1id]}:** ${Math.round(e.champ1.winrate * 100 * 1000) / 1000}% winrate (${e.champ1.wins} wins)
**${teemo.champs[champ2id]}:** ${Math.round(e.champ2.winrate * 100 * 1000) / 1000}% winrate (${e.champ2.wins} wins)`
                                }
                            ]
                        }});
                    }


                });

                if (!foundMatchup && !msg.author.bot)
                    msg.channel.send(`${global.client.user} lol matchup ${match[1]} ${match[3]} ${match[2]}`);
                else if (!foundMatchup)
                    msg.channel.send("not enough data for that matchup :/");

            }).catch(e => {
                msg.channel.send("champion.gg api appears to be having issues (again).");
                console.error(e);
                throw e;
            });

        }, tests: [ "-lol matchup mid yasuo anivia", "-lol matchup synergy ashe + janna",
            "-lol matchup mid zed vs. yasuo" ]
    },

    { // champgg winrate
        condition: msg => msg.content.match(/^lol wr (\S+)/),
        act: async function (msg) {
            const champName = this.condition(msg)[1];
            const champ = teemo.champIDs[champName.toLowerCase()];
            if (!champ) {
                msg.channel.send(`Unknown champion ${champName}. Make sure spelling is correct and there are no spaces or special characters`);
                return;
            }

            teemo.champgg.get('champion.getChampion', champ).then(data =>
                data.forEach(d =>
                    msg.channel.send(`${teemo.champs[champ]} ${d.role.trim().toLowerCase()} has a winrate of ${Math.round(d.winRate * 10000) / 100}`)
                )
            ).catch(e => {
                msg.channel.send("champion.gg api appears to be having issues (again).");
                console.error(e);
                throw e;
            });;
        },
        tests: [ "-lol wr corki" ]
    },

    // meta champs and stuff
    {
        condition: msg => msg.content.match(/^lol meta\s?(\S+)?/),
        act: async function (msg) {
            const elo = this.condition(msg)[1];

            try {
                const data = (await (elo ?
                    teemo.champgg.get("overall", {elo : elo.toUpperCase()})
                    : teemo.champgg.get("overall") ))[0];
                console.log(data);
            } catch (e) {
                msg.channel.send("champion.gg api appears to be having issues (again).")
            }

            const formatElo = elo => {
                if (elo == "DUO_CARRY")
                    return "Bottom";
                if (elo == "DUO_SUPPORT")
                    return "Support";
                elo = (elo[0].toUpperCase() + elo.slice(1).toLowerCase());
                // plat+
                const cmb = elo.split(',');
                if (cmb.length > 1)
                    elo = cmb[0] + '+';

                return elo;
            }


            msg.channel.send({ embed: {
                title: `Meta Champs ${formatElo(data.elo)} patch ${data.patch}`,
                fields: Object.keys(data.positions).map(role => {
                    return {
                        name: formatElo(role),
                        value: `
**Best Win Rate:** ${teemo.champNames[data.positions[role].winrate.best.championId]
    } -- ${Math.round(10000 * data.positions[role].winrate.best.score) / 100}
**Worst Win Rate:** ${teemo.champNames[data.positions[role].winrate.worst.championId]
    } -- ${Math.round(10000 * data.positions[role].winrate.worst.score) / 100}
**Best Champion.gg power rating:** ${teemo.champNames[data.positions[role].performanceScore.best.championId]
    } -- ${Math.round(1000 * data.positions[role].performanceScore.best.score) / 1000}
**Worst Champion.gg power rating:** ${teemo.champNames[data.positions[role].performanceScore.worst.championId]
    } -- ${Math.round(1000 * data.positions[role].performanceScore.worst.score) / 1000}`
                    };
                }),

            }});
        }
    }
];
