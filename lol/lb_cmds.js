const teemo = require("./teemo");
const lb = require("./lol_leaderboard");
const mods = require("../sam/mods");


module.exports = [
    { // add lb to channel
        condition: msg => msg.content.match(/^lol add-lb (\S+) ([0-9]+)/),
        act: async function (msg) {

            if (!msg.guild)
                return msg.channel.send("This is only available for servers");
            if (!mods.auth(msg))
                return;

            const match = this.condition(msg);
            const champ = teemo.champIDs[match[1]];
            const period = Number(match[2]) * 60 * 60 * 1000 * 24;


            let rules = lb.getRules(msg.guild.id);
            rules.push({
                champ: champ,
                chan: { name: msg.channel.name, id: msg.channel.id },
                cd: { ts: 0, period: period },
                prev: []
            });
            console.log(rules);
            lb.setRules(msg.guild.id, rules);

            msg.react("👍");
        }
    }


];
