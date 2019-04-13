const sam = require("./sam");
const mods = require("./mods")
const bl = require("./blacklist");
const logCmd = require("../logging");


module.exports = [
    {
        condition: msg => msg.content.match(/(?:bl|blacklist) (?:guild|server)/),
        act: async msg => {
            logCmd(msg, "-blacklist guild");
            if (!msg.guild)
                return msg.channel.send("Sorry, you can't blacklist a dm");

            if (!mods.auth(msg))
                return;

            bl.addGuild(msg.guild.id);
            msg.react("👍");
        }
    },

    {
        condition: msg => msg.content.match(/(?:bl|blacklist) chan(?:nel)?/),
        act: async msg => {
            logCmd(msg, "-blacklist channel");
            if (!msg.guild)
                return msg.channel.send("Sorry you can't blacklist a dm");
            if (!mods.auth(msg))
                return;

            let blChans = bl.guildChans(msg.guild.id);
            // prevent duplicates
            if (!blChans.includes(msg.channel.id))
                blChans.push(msg.channel.id);

            bl.setGuildChans(msg.guild.id, blChans);
            msg.react("👍");
        }
    },

    { // unblacklist a given channel/server
        condition: msg => msg.content.match(/(?:bl|blacklist) remove ([0-9]+)/),
        act: async function (msg) {
            logCmd(msg, "-blacklist remove ()");
            const id = this.condition(msg)[1];

            const guild = global.client.guilds.get(id);
            const chan = global.client.channels.get(id);
            if (guild) {
                if (!mods.isMod(guild.id, msg.author.id))
                    return msg.channel.send("You are not authorized to perform this action. \
Ask the server's owner to promote you to admin or grant you access to this command via the web portal\n");

                bl.setGuilds(bl.guilds().filter(gid => gid != id));

            } else if (chan) {

                if (!chan.guild)
                    return msg.react("👍");

                if (!mods.isMod(chan.guild.id, msg.author.id))
                    return msg.channel.send("You are not authorized to perform this action. \
Ask the server's owner to promote you to admin or grant you access to this command via the web portal\n");

                bl.setGuildChans(chan.guild.id,
                    bl.guildChans(chan.guild.id)
                        .filter(c => c != id));
            }

            msg.react("👍");
        }
    }

]
