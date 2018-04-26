const teemo = require("./teemo.js");
const lol = require("./lol_stuff.js");
const logCmd = require("./logging.js");



module.exports = [


    { // a specific summoner's mastery of a specific champ
        condition: function (msg) {
            return msg.content.match(/^\-mastery (\S+) (\S+) (.+)/)
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

    { // -mastery help
        condition: function (msg) {
            return msg.content.match(/^\-mastery/);
        },
        act: async function (msg) {
            msg.channel.send("For now, the format of `-mastery` is: `-mastery <champ> <server> <summoner-name>`");
        }

    },



    { // add acct
        condition: function (msg) {
            return msg.content.match(/^\-add-lol (\S+) (.+)/);
        },
        act: async function (msg) {
            logCmd(msg, "linked an LoL acct (-add-lol)");

            const match = msg.content.match(/-add-lol (\S+) (.+)/);
            const server = teemo.serverNames[match[1]];
            const summoner = match[2];

            lol.addUserAcct(msg, server, summoner);

        }

    },

    { // list accts
        condition: function (msg) {
            return msg.content.match(/^\-list-lol/);
        },
        act: async function (msg) {
            logCmd(msg, "listed lol accts. (-list-lol)")
            var userObj = lol.getUserData(msg.author.id);

            var str = `${msg.author} has ${userObj.accounts.length} accounts:\n`;
            for (var i = 0; i < userObj.accounts.length; i++)
                str += `[${i}]: ${userObj.accounts[i].server} ${userObj.accounts[i].name}\n`;

            str += `main account: ${userObj.main}`;

            msg.channel.send(str);
        }
    },


    { // main acct
        condition: function (msg) {
            return msg.content.match(/^-main-lol ([0-9])/);
        },
        act: async function (msg) {
            logCmd(msg, "modified their main account");
            var userObj = lol.getUserData(msg.author.id);
            userObj.main = msg.content.match(/^-main-lol ([0-9])/)[1];
            lol.setUserData(msg.author.id, userObj);
            msg.channel.send("main account updated");
        }
    }



];
