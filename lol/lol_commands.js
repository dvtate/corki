const fs = require("fs");

const logCmd = require("../logging.js");

const teemo = require("./teemo.js");
const lol = require("./lol_stuff.js");

const lol_lb = require("./lol_leaderboard.js");

module.exports = [

    { // a specific summoner's mastery of a specific champ
        condition: msg => msg.content.match(/^lol mastery (\S+) (\S+) (.+)/),
        act: async function (msg) {
            const match = this.condition(msg);
            const champ = teemo.champIDs[match[1].toLowerCase()];
            const server = teemo.serverNames[match[2].toLowerCase()];

            if (!champ || !server)
                return msg.channel.send(`invalid ${!champ ? "champion" : "region"} (run \`-lol mastery help\` for more)`);


            // get summoner id
            teemo.riot.get(server, "summoner.getBySummonerName", match[3]).then(summoner => {
                // get champ mastery
                teemo.riot.get(server, "championMastery.getChampionMastery", summoner.id, champ).then(data => {
                    // send mastery to channel
                    if (!data)
                        msg.channel.send(`${summoner.name} has never played ${teemo.champs[champ]}`);
                    else
                        msg.channel.send(`${summoner.name} has mastery level ${data.championLevel} with ${data.championPoints} points on ${teemo.champs[champ]}`);
                });

            }).catch(err => {
                msg.channel.send(`${match[3]} wasn't found on ${match[2]} (run \`-lol mastery help\` for more)`);
            });

        },
        tests: [ "-lol mastery corki na ridderhoff" ]
    },

    { // mastery of a different user
        condition: msg => msg.content.match(/^lol mastery (\S+) <@!?([0-9]+)>/),
        act: async function (msg) {
            logCmd(msg, "checked lol mastery");
            const match = this.condition(msg);
            const champID = teemo.champIDs[match[1].toLowerCase()];
            const id = match[2];

            if (!champID)
                return msg.channel.send("invalid champion (run `-lol mastery help` for more)");


            lol.getUserMastery(id, champID).then(data =>
                msg.channel.send(`<@!${id}> has mastery level ${data.lvl} with ${data.pts} points on ${teemo.champs[champID]}`)
            ).catch(err =>
                msg.channel.send("They don't have any linked accounts. They should use `-lol add` to link their account(s)")
            );

        },
        tests: [ "-lol mastery corki <@253784341555970048>" ]
    },


    { // self mastery of a champ
        condition: msg => msg.content.match(/^lol mastery (\S+)/),
        act: async function (msg) {
            logCmd(msg, "checked lol mastery");
            const champName = this.condition(msg)[1].toLowerCase();
            const champID =  teemo.champIDs[champName];

            if (!champID)
                return msg.channel.send("invalid champion (run `-lol mastery help` for more)");

            lol.getUserMastery(msg.author.id, champID).then(data =>
                msg.channel.send(`<@!${msg.author.id}> has mastery level ${data.lvl} with ${data.pts} points on ${teemo.champs[champID]}`)
            ).catch(err => {
                console.log(err);
                msg.channel.send("you don't have any linked accounts. you should use `-lol add` to link your account(s)")
            });
            msg.channel.stopTyping();
        }
    },

    { // -mastery help
        condition: msg => msg.content.match(/^(?:mastery|lol mastery|help lol mastery)(?:$|\s)/),
        act: async function (msg) {
            logCmd(msg, "got help with `-lol mastery`");
            msg.channel.send(masteryHelpInfo);
        }
    },

    { // add acct
      // profile icon verification

        condition: msg => msg.content.match(/^lol add (\S+) (.+)/),
        act: async function (msg) {
            logCmd(msg, "linked an LoL acct (-lol add)");

            const match = this.condition(msg);
            const server = teemo.serverNames[match[1].toLowerCase()];
            if (!server)
                return msg.channel.send("Invalid/Missing region. Use `-lol servers` to see a list of regions");

            const name = match[2];
            const summoner = await teemo.riot.get(server, "summoner.getBySummonerName", name);
            if (!summoner)
                return msg.channel.send(`Sorry, couldn't find ${name} on ${match[1]}. Make sure everything is spelled correctly.`);


            // make userdir
            lol.setupDir(msg.author.id);

            let pend;
            try {
                pend = JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/users/${msg.author.id}/pending.json`));
            } catch (e) {
                pend = null;
            }

            if (!pend || pend.id != summoner.id || pend.region != server) {

                msg.channel.send(`Change ${name}'s icon to ${
                   summoner.profileIconId == 20 ? "<:icon23:470033522862587926>" :
                   "<:icon20:470033547571494912>"} then run the command again.`);

                pend = {
                   icon: summoner.profileIconId == 20 ? 23 : 20,
                   region: server,
                   summoner: name,
                   id: summoner.id
                };

                fs.writeFileSync(
                   `${process.env.HOME}/.corki/users/${msg.author.id}/pending.json`,
                   JSON.stringify(pend));

                return;

            } else if (summoner.profileIconId != pend.icon) {
                return msg.channel.send(`change your profile icon to ${
                    summoner.profileIconId == 20 ? "<:icon23:470033522862587926>" :
                    "<:icon20:470033547571494912>" } then run the command again.`);
            }

            lol.addUserAcct(msg.author.id, server, name).then(() =>
                msg.react("👍")
            ).catch(err =>
                msg.channel.send(`That didn't work. Check server and username\n\`\`\`\nerr: ${err.stack}\n\`\`\``)
            );

            fs.unlink(
                `${process.env.HOME}/.corki/users/${msg.author.id}/pending.json`,
                (e) => { if (e) throw e; });

        },
        tests: [ "-lol add na imaqtpie" ]
    },

    { // -lol add help
        condition: msg => msg.content.match(/^lol add(?:$|\s)/),
        act: msg => msg.channel.send(`
            To add your account you need to include your region and summoner name
For example: \`-lol add na ridderhoff\`

Alternatively, you can use the web portal to add your account. https://corki.js.org/portal?rdr=user`)
    },

    { // reset accounts list
        condition: msg => msg.content.match(/^lol reset/),
        act: async function (msg) {
            logCmd(msg, "reset lol data (-lol reset)");
            lol.removeDir(msg.author.id);
            msg.channel.send("unlinked your accounts!");
        },
        tests: [ "-lol reset" ]
    },

    { // list another user's accts
        condition: msg => msg.content.match(/^lol list(?: <@!?([0-9]+)>)?/),
        act: async function (msg) {
            logCmd(msg, "listed a user's lol accts. (-lol list)");

            const id = this.condition(msg)[1] || msg.author.id;
            const userObj = lol.getUserData(id);

            if (!userObj || !userObj.accounts.length)
                return msg.channel.send("They don't have any linked accounts. They should use `-lol add` to link their account(s)");

            let str = `<@!${id}> has ${userObj.accounts.length} accounts:\n`;
            for (let i = 0; i < userObj.accounts.length; i++)
                str += `[${i}]: ${userObj.accounts[i].server} ${userObj.accounts[i].name}\n`;

            str += `main account: ${userObj.main}`;

            msg.channel.send(str);
        },
        tests: [ "-lol list", "-lol list <@253784341555970048>" ]
    },

    { // main acct
        condition: msg => msg.content.match(/^lol main ([0-9])/),
        act: async function (msg) {
            logCmd(msg, "modified their main account");
            let userObj = lol.getUserData(msg.author.id);
            if (!userObj || !userObj.accounts.length)
                return msg.channel.send("you don't have any linked accounts. you should use `-lol add` to link your account(s)");

            userObj.main = this.condition(msg)[1];
            lol.setUserData(msg.author.id, userObj);
            msg.channel.send("main account updated");
        },
        tests: [ "-lol main" ]
    },

    {
        condition: msg => msg.content.match(/^lol main/),
        act: async function (msg) {
            logCmd(msg, "checked their main -lol acct");
            let userObj = lol.getUserData(msg.author.id);
            if (userObj && userObj.accounts)
                msg.channel.send(`Your main account is ${userObj.accounts[userObj.main].server} ${userObj.accounts[userObj.main].name}
to change it use \`-lol main <account-number>\`, (account number can be fonud via \`-lol list\``);
            else
                msg.channel.send("you don't have any linked accounts. you should use `-lol add` to link your account(s)");

        }
    },

    { // refresh mastery info, if its needed
        condition: msg => msg.content.match(/^lol refresh(?: <@!?([0-9]+)>)?/),
        // TODO: (?: <@!?([0-9]+)>)?
        act: async function (msg) {
            logCmd(msg, "-lol refreshed");


            const id = this.condition(msg)[1] || msg.author.id;

            if (!lol.getUserData(id))
                msg.channel.send(
                    (id == msg.author.id ? "You" : "they")
                    + " don't have any linked accounts. you should use `-lol add` to link your account(s)");

            msg.channel.startTyping();

            // refresh account info
            await lol.refreshUserData(msg.author.id);

            // refresh mastery points
            require("./user_mastery").refresh(msg.author.id);

            msg.channel.stopTyping();
            msg.react("👍");
        }
    },

    { // dev tool
        condition: msg => msg.content.match(/^lol api ([\S\s]+)/),
        act: async function (msg) {
            logCmd(msg, "made a call to teemo.js");
            if (!require("../bot_admins").auth(msg.author.id))
                return msg.chanel.send("You must be a bot developer to use this command");

            const args = this.condition(msg)[1].split(" ");
            teemo.riot.get.apply(teemo.riot, args)
                .then(data => msg.channel.send(JSON.stringify(data)))
                .catch(err => msg.channel.send(`err: ${err}`));
        }
    },

    { // mastery leaderboard for server members
        condition: msg => msg.content.match(/^lol (?:leaderboard|lb) (\S+)/),
        act: async function (msg) {
            if (!msg.guild)
                return msg.channel.send("This is only available for servers");

            let timer = process.hrtime();

            logCmd(msg, "generated leaderboard");

            const champID = teemo.champIDs[this.condition(msg)[1].toLowerCase()];
            if (!champID)
                return msg.channel.send("invalid champion name (make sure to remove spaces)");

            msg.channel.startTyping();
            lol_lb.getLeaderBoard(msg.guild.members, champID).then(data => {
                msg.channel.send(`**${teemo.champNames[champID]} Mastery Leaderboard:**\n` + lol_lb.formatLeaderBoard(data))

                let time = process.hrtime(timer);
                const ns_per_s = 1e9;
                time = (time[0] * ns_per_s + time[1]) / (ns_per_s)

                msg.channel.send(`that took ${time} seconds to complete`);
                msg.channel.stopTyping();
            });
            setTimeout(msg.channel.stopTyping, 3000);


        },
        tests: [ "-lol lb corki" ]
    },

    { // mastery leaderboard for all of the bot's users
        condition: msg => msg.content.match(/^lol (?:global (?:leaderboard|lb)|glb) (\S+)/),
        act: async function (msg) {
            logCmd(msg, "generated leaderboard");

            let timer = process.hrtime();

            const champID = teemo.champIDs[this.condition(msg)[1].replace(/\s/g, '').toLowerCase()];
            if (!champID)
                return msg.channel.send("invalid champion name (make sure to remove spaces)");

            msg.channel.startTyping();

            lol_lb.getLeaderBoard(msg.client.users, champID).then(data => {
                msg.channel.send(`**${teemo.champNames[champID]} Mastery Leaderboard:**\n` + lol_lb.formatLeaderBoard(data))

                let time = process.hrtime(timer);
                let ns_per_s = 1e9;
                time = (time[0] * ns_per_s + time[1]) / ns_per_s;

                msg.channel.send(`that took ${time} seconds to complete`);
                msg.channel.stopTyping();
            });
            setTimeout(msg.channel.stopTyping, 3000);
        },
        tests: [ "-lol glb corki" ]

    },

    { // list supported server names
        condition: msg => msg.content.match(/^lol servers(?:$|\s)/),
        act: async function (msg) {
            logCmd(msg, "asked for -lol servers");
            msg.channel.send("Corki supports LoL accounts on the following servers: "
                + Object.keys(teemo.serverNames).join(", "));
        }, tests: [ "-lol servers" ]
    },

    {
        condition: msg => msg.content.match(/^lol rank(?: <@!?([0-9]+)>)? all|^lol ranks(?: <@!?([0-9]+)>)?/),
        act: async function (msg) {
            logCmd(msg, "checked a users -lol ranks");

            const userid = this.condition(msg)[1] || this.condition(msg)[2] || msg.author.id;
            let userObj = lol.getUserData(userid);

            // no accts.
            if (!userObj || !userObj.accounts.length)
                return msg.channel.send("You don't have any linked accounts. You should use `-lol add` to link your account(s)");

            // generate rank summary for each acct
            userObj.accounts.forEach(acct =>
                teemo.riot.get(acct.server, "league.getAllLeaguePositionsForSummoner", acct.id).then(rank =>
                    lol.makeRankSummary(msg.client.users.get(userid).username, acct.name, rank)
                        .then(summary => msg.channel.send(summary)).catch(console.error)
                ).catch(console.error)
            );
        }
    },

    { // other user's rank
        condition: msg => msg.content.match(/^lol rank <@!?([0-9]+)>(?: ([0-9]+))?/),
        act: async function (msg) {
            logCmd(msg, "checked a user's -lol rank");

            const match = this.condition(msg);
            const id = match[1];
            let userObj = lol.getUserData(id);

            if (!userObj || !userObj.accounts.length)
                return msg.channel.send("They don't have any linked accounts. They should use `-lol add` to link their account(s)");

            // pick acct
            let acct = userObj.accounts[match[2] ? match[2].trim() : userObj.main];
            if (!acct)
                return msg.channel.send("Invalid account number. Use `-lol list` to see available accounts");

            // send rank summary for acct
            teemo.riot.get(acct.server, "league.getAllLeaguePositionsForSummoner", acct.id).then(rank =>
                lol.makeRankSummary(msg.client.users.get(id).username, acct.name, rank)
                    .then(summary => msg.channel.send(summary)).catch(console.error)
            ).catch(console.error);

        },
        tests: [ "-lol rank <@253784341555970048>" ]
    },

    { // given summoner's rank
        condition: msg => msg.content.match(/^lol rank (\S+) (.+)/),
        act: async function (msg) {
            logCmd(msg, "checked an account's -lol rank");

            const match = this.condition(msg);
            const server = teemo.serverNames[match[1].toLowerCase()];

            if (!server)
                return msg.channel.send("invalid server (run `-lol servers` for more)");

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

        },
        tests: [ "-lol rank na ridderhoff" ]
    },

    { // self rank
        condition: msg => msg.content.match(/^lol rank\s?([0-9]+)?(?:$|\s)/),
        act: async function (msg) {
            logCmd(msg, "checked their -lol rank");
            let userObj = lol.getUserData(msg.author.id);

            if (!userObj || !userObj.accounts.length)
                return msg.channel.send("You don't have any linked accounts. You should use `-lol add` to link your account(s)");

            const match = this.condition(msg);
            let acct = userObj.accounts[match[1] ? match[1].trim() : userObj.main];
            if (!acct)
                return msg.channel.send("Invalid account number. Use `-lol list` to see available accounts");

            teemo.riot.get(acct.server, "league.getAllLeaguePositionsForSummoner", acct.id).then(rank => {
                lol.makeRankSummary(msg.client.users.get(msg.author.id).username, acct.name, rank)
                    .then(summary => msg.channel.send(summary)).catch(console.error)
            }).catch(console.error);
        }
    },

    { // summary of user champion mastery levels
        condition: msg => msg.content.match(/^lol masteries(?:$|\s)/),
        act: async msg => {
            logCmd(msg, "got mastery info");

            // get their main account
            let userObj = lol.getUserData(msg.author.id);

            if (!userObj || !userObj.accounts.length)
                return msg.channel.send("You don't have any linked accounts. You should use `-lol add` to link your account(s)");

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

    },


    { // list user's mastery 7 champs
        condition: msg => msg.content.match(/^lol (?:mastery7|m7|mastery seven)(?:$|\s)/),
        act: async msg => {
            logCmd(msg, "-lol m7");

            // get their main account
            let userObj = lol.getUserData(msg.author.id);

            if (!userObj || !userObj.accounts.length)
                return msg.channel.send("You don't have any linked accounts. You should use `-lol add` to link your account(s)");


            let champs = [];

            /*
            [
                {
                    id : champ id,
                    pts : total pts,
                    accts : num accts w/ m7
                }
            ]
            */

            // fill a list with mastery promise requests
            let dreqs = userObj.accounts.map(a => teemo.riot.get(a.server, "championMastery.getAllChampionMasteries", a.id));
            // request them all at once
            Promise.all(dreqs).then(accts => {

                accts.forEach(data => {
                    // for each champ on given acct
                    for (let i = 0; i < data.length; i++) {
                        // do they already have m7 on another acct or something
                        let entry = champs.findIndex(e => { return e.id == data[i].championId; });


                        // skip useless data
                        if (data[i].championLevel < 7 && entry == -1)
                            continue;

                        // no entry for this champ yet
                        if (entry == -1) {
                            champs.push({
                                id: data[i].championId,
                                pts: data[i].championPoints,
                                accts: 1
                            });

                        // append to prexisting entry
                        } else {
                            champs[entry].accts++;
                            champs[entry].pts += data[i].championPoints;
                        }

                    }
                });

                // generate summary
                let summary = "**Mastery 7 Champs:**\n";
                champs.forEach(champ => {
                    summary += `**${teemo.champs[champ.id]}:** ${champ.pts} points (${champ.accts} accounts)\n`;
                });

                // send summary or if they dont have m7 tell them
                if (champs.length == 0)
                    msg.channel.send("You have no m7 champs");
                else
                    msg.channel.send(summary);


            });

        }

    },

    { // info for latest game
        condition: msg => msg.content.match(/^lol lastgame/),
        act: async msg => {

            logCmd(msg, "checked last game stats");

            // get their main account
            let userObj = lol.getUserData(msg.author.id);

            if (!userObj || !userObj.accounts.length)
                return msg.channel.send("You don't have any linked accounts. You should use `-lol add` to link your account(s)");

            msg.channel.send("sorry this hasn't been implemented yet.\
*ETA:* Spring 2019*\
If you want to see this implemented sooner send a `-bug` report.");
        }
    },


    { // convert champ name/id
        condition: msg => msg.content.match(/^lol c (\S+)/),
        act: async function (msg) {
            logCmd(msg, "-lol c")
            msg.channel.send(teemo.champs[this.condition(msg)[1].toLowerCase()]);
        }, tests: [ "-lol c corki", "-lol c corki" ]
    },

    {
        condition: msg => msg.content.match(/^lol ddragon (\S+)/),
        act: async function (msg) {
            msg.channel.send(teemo.ddragon.url + this.condition(msg)[1]);
        }
    },

    // botAdmin command to manually add a user's account, like for example if they're banned or sth..
    {
        condition: msg => msg.content.match(/^lol ba-add <@!?([0-9]+)> (\S+) (.+)/),
        act: async function (msg) {

            if (!require("../bot_admins").auth(msg.author.id))
                return msg.channel.send("You are unauthorized to use this command");

            const match = this.condition(msg);
            const userid = match[1],
                  region = teemo.serverNames[match[2].toLowerCase()],
                  summoner = match[3];

            if (!region)
                return msg.channel.send("invalid region");

            lol.addUserAcct(userid, region, summoner).then(() =>
                msg.react("👍")
            ).catch(err =>
                msg.channel.send(`That didn't work. Check server and username\n\`\`\`\nerr: ${err.stack}\n\`\`\``)
            );

        }
    },

    // how many games have you played on a given champ?
    {
        condition: msg => msg.content.match(/^lol games (\S+)(?: <@!?([0-9]+)>)?/),
        act: async function (msg) {
            logCmd(msg, "-lol games ()");
            const match = this.condition(msg),
                  userId = match[2] || msg.author.id,
                  userObj = lol.getUserData(userId);

            if (!userObj || !userObj.accounts.length)
                return msg.channel.send("No linked accounts! Use `-lol add` to link accounts.");

            const champ = teemo.champIDs[match[1]];

            // matchlist promises
            let dreqs = userObj.accounts.map(a =>
                teemo.riot.get(a.server, "match.getMatchlist", a.accountId, { champion: champ }));

            // fetch the matchlists
            Promise.all(dreqs).then(mls => {

                // sum up totalgames and send to user
                let totalGames = 0;
                mls.forEach(ml => totalGames += ml ? ml.totalGames || 0 : 0);
                msg.channel.send(`${msg.author} has played ${totalGames} games on ${teemo.champNames[champ]}`);
            });
        }
    }
];


const masteryHelpInfo = { embed: {
    title: "-lol mastery information",
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
