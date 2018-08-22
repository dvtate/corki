
const fs = require("fs");

const logCmd = require("../logging");
const sam = require("./sam");
const mods = require("./mods");


/*

Config File Format
	~/.corki/servers/serverid/announce_new_members.json

	[ // there could be multiple announcements for a given server
		{ // announcement
			id: channel id,
			msg: message template
		}, ...
	]


*/

function setAnnouncementData(serverid, data) {
	sam.makeServerDir(serverid);

	fs.writeFileSync(`${process.env.HOME}/.corki/servers/${serverid}/announce_new_members.json`,
		data ? JSON.stringify(data) : "[]");
}


function getAnnouncementData(serverid) {
	// if no configuration data return array with no rules
	if (!fs.existsSync(`${process.env.HOME}/.corki/servers/${serverid}/announce_new_members.json`))
		return [];

	// else return rules array
	return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${serverid}/announce_new_members.json`));
}

async function welcomeNewMember(member) {

	let needsPruning = false;
	const rules = getAnnouncementData(member.guild.id);
	rules.forEach(r => {
		// replace specials
		const msg = r.msg
			.replace("{{server}}", member.guild.name)
			.replace(/\{\{(?:mention|member)\}\}/, member.toString())
			.replace(/\{\{members?Count\}\}/, member.guild.memberCount);

		const chan = global.client.channels.get(r.id);
		if (!chan)
			needsPruning = true;
		else
			chan.send(msg);
	});

	if (needsPruning)
		pruneRules(member.guild.id);

}

function pruneRules(serverid) {
	setAnnouncementData(serverid,
		getAnnouncementData(serverid)
			.filter(r => global.client.channels.has(r.id)));
}


module.exports = [

	{ // with custom welcome msg
		condition: msg => msg.content.match(/^announce-new-members ([\s\S]+)/),
		act: async function (msg) {

			// no bot users
	        if (msg.author.bot)
	            return;

			logCmd(msg, "added a new member announcement");

			// doesn't make sense for htis in dms
			if (!msg.guild) {
				msg.channel.send("This command can not be used in a DM");
				return;
			}

	        // mod only cmd
	        if (!mods.isMod(msg.guild.id, msg.author.id)) {
	            msg.channel.send("You are not authorized to perform this action. \
Ask the server's owner to promote you to admin or grant you access to this command via the web portal\n");
	            logCmd(msg, "isn't authorized to use -msg");
	            return;
	        }

			const msgTemplate = this.condition(msg)[1];

	        let chans = getAnnouncementData(msg.guild.id);

	        chans.push({
				id: msg.channel.id,
				msg: msgTemplate
			});

			setAnnouncementData(msg.guild.id, chans);

	        msg.channel.send("New members will be welcomed here");
		}

	},

    {
        condition: msg => msg.content.match(/^announce-new-members(?:$|\s)/),
        act: async msg => {

			// no bot users
            if (msg.author.bot)
                return;

			logCmd(msg, "added a new member announcement");

			// doesn't make sense for htis in dms
			if (!msg.guild) {
				msg.channel.send("This command can not be used in a DM");
				return;
			}

            // mod only cmd
            if (!mods.isMod(msg.guild.id, msg.author.id)) {
                msg.channel.send("You are not authorized to perform this action. \
Ask the server's owner to promote you to admin or grant you access to this command via the web portal\n");
                logCmd(msg, "isn't authorized to use -msg");
                return;
            }

            let chans = getAnnouncementData(msg.guild.id);

            chans.push({
				id: msg.channel.id,
				msg: "Welcome to {{server}}, {{mention}}!"
			});

			setAnnouncementData(msg.guild.id, chans);

            msg.channel.send("New members will be welcomed here");
        }

    },


	{
        condition: msg => msg.content.match(/^ignore-new-members(?:$|\s)/),
        act: async msg => {

			// no bots
            if (msg.author.bot)
                return;

			logCmd(msg, "reset new member announcement(s)");

			// dms dont make sense for this
			if (!msg.guild) {
				msg.channel.send("This command can not be used in a DM");
				return;
			}

			// mod cmd
            if (!mods.isMod(msg.guild.id, msg.author.id)) {
				msg.channel.send("You are not authorized to perform this action. \
Ask the server's owner to promote you to admin or grant you access to this command via the web portal\n");
				logCmd(msg, "isn't authorized to use -msg");
				return;
			}

			// list of new member announcement rules
			let rules = getAnnouncementData(msg.guild.id);

			// remove all rules involving this channel
			rules = rules.filter(c => c.id != msg.channel.id);

			setAnnouncementData(msg.guild.id, rules);

            msg.channel.send("New Members will not be welcomed here");

        }


    }

]


module.exports.setAnnouncementData = setAnnouncementData;
module.exports.getAnnouncementData = getAnnouncementData;
module.exports.welcomeNewMember = welcomeNewMember;
module.exports.pruneRules = pruneRules;
