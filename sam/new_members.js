
const fs = require("fs");

const logCmd = require("../logging");
const sam = require("./sam")



// welcome new members to the server
global.client.on("guildMemberAdd", member => {
	if (fs.existsSync(`${process.env.HOME}/.corki/servers/${member.guild.id}/announce_new_members.json`)) {
		const rules = JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${member.guild.id}/announce_new_members.json`));
		rules.forEach(r => {
			// replace specials
			const msg = r.msg.replace("{{server}}", msg.guild.name)
				.replace(/\{\{(?:mention|member)\}\}/, member.toString())
				.replace("{{server}}", member.guild.name)
				.replace("{{memberCount}}", member.guild.memberCount);

			global.client.channels.get(r.id).send(msg)
		});
	}
});



module.exports = [

    {
        condition: (msg) => msg.content.match(/^-announce-new-members/),
        act: async (msg) => {
			logCmd(msg, "added a new member announcement");

			if (!msg.guild) {
				msg.channel.send("This command can only be used in a DM");
				return;
			}

			let perms = mods.getModData(msg.guild.id, msg.author.id);

            // if they don't have roles priveleges or are a bot then stop them
            if (!botAdmins.auth(msg.author.id) && !guild.members.get(msg.author.id).permissions.has(global.Discord.Permissions.FLAGS.ADMINISTRATOR) && !perms.admin && !perms.mod_cmds) {
                msg.channel.send("You are not authorized to perform this action. \
Ask the server's owner to promote you to admin or grant you access to this command via the web portal\n");
                logCmd(msg, "isn't authorized to use -msg");
                return;
            }


			sam.makeServerDir(msg.guild.id);


            let chans = [];
            if (fs.existsSync(`${process.env.HOME}/.corki/servers/${msg.guild.id}/announce_new_members.json`))
                chans = JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${msg.guild.id}/announce_new_members.json`));

            chans.push({
				id: msg.channel.id,
				msg: "Welcome to {{server}}, {{mention}}!"
			});

            fs.writeFileSync(`${process.env.HOME}/.corki/servers/${msg.guild.id}/announce_new_members.json`, JSON.stringify(chans));

            msg.channel.send("New members will be welcomed here");
        }

    }, {
        condition: (msg) => msg.content.match(/^-ignore-new-members/),
        act: async (msg) => {
            // go ahead and make a server directory, doesnt hurt anything
			sam.makeServerDir(msg.guild.id);

            // if they have rules
            if (fs.existsSync(`${process.env.HOME}/.corki/servers/${msg.guild.id}/announce_new_members.json`)) {
                // list of new member announcement rules
                let rules = JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${msg.guild.id}/announce_new_members.json`));
                // remove all rules involving this channel
                rules = rules.filter(c => c.id != msg.channel.id);
                // apply changes
                fs.writeFileSync(`${process.env.HOME}/.corki/servers/${msg.guild.id}/announce_new_members.json`,
                                 JSON.stringify(chans));
            }

            msg.channel.send("New Members will not be welcomed here");

        }


    }

]
