const teemo = require("./teemo.js");
const lol = require("./lol_stuff.js");



module.exports = [
    {
        condition: function (msg) {
            return msg.content.match(/^\-mastery (\S+) (\S+) (.+)/)
        },
        act: async function (msg) {
            const match = msg.content.match(/^\-mastery (\S+) (\S+) (.+)/);

            const champ = teemo.champIDs[match[1]];
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
                        msg.channel.send(`${match[3]} has never played ${match[1]}`);
                    else
                        msg.channel.send(`Mastery level ${data.championLevel} with ${data.championPoints} points`);


                })

            }).catch(err => {
                msg.channel.send(`"${match[3]} wasn't found on ${match[2]}"`);
            });
        }
    }


];
