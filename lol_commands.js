const teemo = require("./teemo.js");
const lol = require("./lol_stuff.js");
const logCmd = require("./logging.js");



module.exports = [


    { // a specific summoner's mastery of a specific champ
        condition: function (msg) {
            return msg.content.match(/^(?:-mastery|-lol mastery) (\S+) (\S+) (.+)/)
        },
        act: async function (msg) {
            const match = msg.content.match(/^\-mastery (\S+) (\S+) (.+)/);

            const champ = teemo.champIDs[match[1].toLowerCase()];
            const server = teemo.serverNames[match[2].toLowerCase()];

            if (!champ) {
                msg.channel.send("invalid champion");
                return;
            }
            if (!server) {
                msg.channel.send("invalid server");
                return;
            }

            teemo.riot.get(server, "summoner.getBySummonerName", match[3]).then(summoner => {

                console.log(summoner);


                teemo.riot.get(server, "championMastery.getChampionMastery", summoner.id, champ).then(data => {
                    if (!data)
                        msg.channel.send(`${summoner.name} has never played ${match[1].toLowerCase()}`);
                    else
                        msg.channel.send(`${summoner.name} has mastery level ${data.championLevel} with ${data.championPoints} points on ${match[1].toLowerCase()}`);


                })

            }).catch(err => {
                msg.channel.send(`"${match[3]} wasn't found on ${match[2]}"`);
            });
        }
    },

    {
        condition: function (msg) {
            return msg.content.match(/^(?:-mastery|-lol mastery) (\S+) <@!?([0-9]+)>/);
        },
        act: async function (msg) {
            const match = msg.content.match(/^(?:-mastery|-lol mastery) (\S+) <@!?([0-9]+)>/);
            const champName = match[1];
            const champID = teemo.champIDs[champName];
            const id = match[2];

            lol.getUserMastery(id, champID).then(pts => {
                msg.channel.send(`<@!${id}> has ${pts} points on ${champName}`);
            });

        }
    },

    {
        condition: function (msg) {
            return msg.content.match(/^(?:-mastery|-lol mastery) (\S+)/)
        },
        act: async function (msg) {
            const champName = msg.content.match(/^(?:-mastery|-lol mastery) (\S+)/)[1];
            const champID =  teemo.champIDs[champName];

            lol.getUserMastery(msg.author.id, champID).then(pts => {
                msg.channel.send(`You have ${pts} points on ${champName}`);
            });
        }

    },

    { // -mastery help
        condition: function (msg) {
            return msg.content.match(/^(?:-mastery|-lol mastery)/);
        },
        act: async function (msg) {
            logCmd(msg, "got help with `-lol mastery`");
            msg.channel.send(masteryHelpInfo);
        }
    },

    { // add acct
        condition: function (msg) {
            return msg.content.match(/^\-lol add (\S+) (.+)/);
        },
        act: async function (msg) {
            logCmd(msg, "linked an LoL acct (-add-lol)");

            const match = msg.content.match(/-lol add (\S+) (.+)/);
            const server = teemo.serverNames[match[1]];
            const summoner = match[2];

            lol.addUserAcct(msg, server, summoner).then(() =>
                msg.channel.send(`${msg.author} is also ${username}`)
            ).catch(err =>
                msg.channel.send(`That didn't work. Check server and username\n\`\`\`\nerr: ${err}\n\`\`\``)
            );

        }

    },

    { // list another user's accts
        condition: function (msg) {
            return msg.content.match(/^-lol list <@!?([0-9]+)>/);
        },
        act: async function (msg) {
            logCmd(msg, "listed a user's lol accts. (-list-lol)");


            const id = msg.content.match(/^-lol list <@!([0-9]+)>/)[1];
            const userObj = lol.getUserData(id);

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
        act: function (msg) {
            logCmd(msg, "made a call to teemo.js");

            const args = msg.content.match(/^-lol api ([\S\s]+)/)[1].split(" ");
            teemo.riot.get.apply(teemo.riot, args)
                .then(data => msg.channel.send(JSON.stringify(data)))
                .catch(err => msg.channel.send(`err: ${err}`) );

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
\`-lol mastery drmundo @testuser\`: show <@436612406400122881>'s points on Dr. Mundo
\`-lol mastery zed kr hideonbush\`: show faker's points on zed`
        }

    ]

}}
