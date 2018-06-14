//"use strict";

// see file if ur concerned about privacy, its not bad
const logCmd = require("./logging.js");

// Import the discord.js module
global.Discord = require("discord.js");

// Create an instance of a Discord client
global.client = new global.Discord.Client();

// bot will only start reacting to information
// from Discord _after_ ready is emitted
global.client.on("ready", () => {
	console.log("Ready to fly!");

	global.client.user.setActivity("corki.js.org | -help", {
		game: {
			url: "https://corki.js.org",
			type: "PLAYING"
		}
	}).catch(console.error);

});


// set up our list of commands
let commands = [];
commands = commands.concat(require("./dev_cmds.js"));
commands = commands.concat(require("./basic_cmds.js"));
commands = commands.concat(require("./international_cmds.js"));
commands = commands.concat(require("./text_cmds.js"));

commands = commands.concat(require("./roles.js"));

// LoL stuff
commands = commands.concat(require("./lol/lol_commands.js"));
// RSS feed used for reddit fwd
commands = commands.concat(require("./rss/rss_cmds.js"));

commands = commands.concat(require("./reactions.js"));
commands = commands.concat(require("./help_cmds.js"));

//commands.concat(require("./.js");

// message event listener
global.client.on('message', async msg => {

	// check each possible command
	for (let i = 0; i < commands.length; i++)
		// if it matches, run it
		if (commands[i].condition(msg)) {
			commands[i].act(msg)
				.catch(e => {
					msg.channel.send(`Sorry, that errored please send a \`-bug\` report\n\`\`\`\n${e.stack}\n\`\`\``);
					require("./bot_admins.js").sendBugReport(msg, ` Error:\n\`\`\`\n${e.stack}\n\`\`\``);
					console.error(`Error(${msg.content}):`);
					console.error(e.stack);
				});
			break; // we're done here
		}

});

// welcome new members to the server
global.client.on("guildMemberAdd", member => {

    // server's new members channel
    const channel = member.guild.channels.find("name", "new_members")
		|| member.guild.channels.find("name", "new-members")
		|| member.guild.channels.find("name", "member-log");

    // if not found give up
    if (!channel)
		return;

    // welcome them
    channel.send(`Welcome to the server, ${member}`);

});

const token = `${require("fs").readFileSync(`${process.env.HOME}/.corki/disc_key`)}`.trim();

// Log bot in using token
global.client.login(token);
