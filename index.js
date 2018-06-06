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


const subreddit_fwd = require("./subreddit_forward.js");
commands = commands.concat(subreddit_fwd.commands);
subreddit_fwd.configure();

commands = commands.concat(require("./roles.js"));
commands = commands.concat(require("./lol/lol_commands.js"));

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
			commands[i].act(msg).then(() => {})
				.catch(e => {
					msg.channel.send("sorry, that error'd please send a `-bug` report\n```" + e + "\n```");
					console.error(`err (${msg.content}):`);
					console.error(e);
				});
			break; // we're done here
		}

});

// welcome new members to the server
global.client.on("guildMemberAdd", member => {

    // server's new members channel
    const channel = member.guild.channels.find("name", "new_members")
		|| msg.guild.channels.find("name", "new-members");

    // if not found give up
    if (!channel)
		return;

    // welcome them
    channel.send(`Welcome to the server, ${member}`);

});

const token = `${require("fs").readFileSync(`${process.env.HOME}/.corki/disc_key`)}`.trim();

// Log bot in using token
global.client.login(token);
