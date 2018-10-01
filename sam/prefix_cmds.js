const logCmd = require("../logging");
const mods = require("./mods");
const prefix = require("./prefix");

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}


module.exports = [
    {
        condition: msg => msg.content.match(/^prefix add (.+)/),
        act: async function (msg) {
            logCmd(msg, "added prefix");

            if (!msg.guild) {
                msg.channel.sent("This commmand can only be run in a server.");
                return;
            }
            if (!mods.isMod(msg.guild.id, msg.author.id)) {
                msg.channel.send("You must be given permission to run server \
management commands in order to perform this action. Ask an administrator to grant \
you these powers via https://corki.js.org/admin");
                return;
            }



            let prefixes = prefix.getGuildPrefixes(msg.guild.id);

            prefixes.push(escapeRegExp(this.condition(msg)[1].trim()));
            prefix.setGuildPrefixes(msg.guild.id, prefixes);
            msg.react("👍");
            msg.channel.send(`Configured prefixes:\n${prefixes.join("\n")}`);
        }
    },

    {
        condition: msg => msg.content.match(/^prefix list(?:$|\s)/),
        act: async msg => {
            logCmd(msg, "listed prefixes");

            let prefixes = prefix.getGuildPrefixes(msg.guild.id);
            msg.channel.send(`Configured prefixes:\n${prefixes.join("\n")}`);
        },
        tests: [ "-prefix list" ]
    },

    {
        condition: msg => msg.content.match(/^prefix set (.+)/),
        act: async function (msg) {
            logCmd(msg, "set prefix");

            if (!msg.guild) {
                msg.channel.sent("This commmand can only be run in a server.");
                return;
            }
            if (!mods.isMod(msg.guild.id, msg.author.id)) {
                msg.channel.send("You must be given permission to run server \
management commands in order to perform this action. Ask an administrator to grant \
you these powers via https://corki.js.org/admin");
                return;
            }

            let prefixes = [ escapeRegExp(this.condition(msg)[1].trim()) ];
            prefix.setGuildPrefixes(msg.guild.id, prefixes);
            msg.react("👍");
        }
    },

    {
        condition: msg => msg.content.match(/^prefix reset/),
        act: async msg => {
            logCmd(msg, "reset prefixes");

            if (!msg.guild) {
                msg.channel.sent("This commmand can only be run in a server.");
                return;
            }
            if (!mods.isMod(msg.guild.id, msg.author.id)) {
                msg.channel.send("You must be given permission to run server \
management commands in order to perform this action. Ask an administrator to grant \
you these powers via https://corki.js.org/admin");
                return;
            }
            prefix.resetGuildPrefixes(msg.guild.id);
            msg.react("👍");
        }
    }
];
