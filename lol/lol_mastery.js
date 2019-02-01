

const teemo = require("teemo.js");



module.exports.cmds = [


      { // a specific summoner's mastery of a specific champ
          condition: msg => msg.content.match(/^lol mastery (\S+) (\S+) (.+)/),
          act: async function (msg) {
              const match = this.condition(msg);

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
              const champName = match[1].toLowerCase();
              const champID = teemo.champIDs[champName];
              const id = match[2];

              if (!champID) {
                  msg.channel.send("invalid champion (run `-lol mastery help` for more)");
                  return;
              }

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

              if (!champID) {
                  msg.channel.send("invalid champion (run `-lol mastery help` for more)");
                  return;
              }

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


};
