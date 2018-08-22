"use strict";

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
global.commands = []
	.concat(require("./cmds/dev_cmds.js"))
	.concat(require("./cmds/basic_cmds.js"))
	.concat(require("./cmds/international_cmds.js"))
	.concat(require("./cmds/text_cmds.js"))
	.concat(require("./sam/roles_cmds.js"))
	.concat(require("./sam/welcome.js"))
	.concat(require("./lol/lol_commands.js"))
	.concat(require("./rss/rss_cmds.js"))
	.concat(require("./cmds/help_cmds.js"));


const interactions = []
	.concat(require("./reactions"));

// message event listener
global.client.on("message", async msg => {

	// check for prefix
	const prefixes = require("./sam/prefix").getGuildPrefixes(msg.guild.id);
	let hascmd = false;
	for (let i = 0; i < prefixes.length; i++) {
		if (msg.content.match(new RegExp('^' + prefixes[i]))) {
			msg.content = msg.content.replace(new RegExp('^' + prefixes[i]), "").trim();
			hascmd = true;
			break;
		}
	}

	if (hascmd)
		// check each possible command
		for (let i = 0; i < commands.length; i++)
			// if it matches, run it
			if (commands[i].condition(msg)) {
				commands[i].act(msg)
					.catch(e => {
						msg.channel.send(`Sorry, that errored. If there's anything you would like to add, send a \`-bug\` report\n\`\`\`\n${e.stack}\n\`\`\``);
						require("./bot_admins.js").sendBugReport(msg, ` Error:\n\`\`\`\n${e.stack}\n\`\`\``);
						console.error(`Error(${msg.content}):`);
						console.error(e.stack);
					});
				break; // we're done here
			}

	interactions.forEach(i => {
		if (i.condition(msg))
			i.act(msg)
			 .catch(e => {
				require("./bot_admins.js").sendBugReport(msg, `Interaction Error:\n\`\`\`\n${e.stack}\n\`\`\``);
				console.error(`InteractionError(${msg.content}):`);
				console.error(e.stack);
			 })
	})

});

// something broke
global.client.on("error", async e => {
	require("./bot_admins.js").sendBugReport(null, `Client Error:\n\`\`\`\n${e.stack}\n\`\`\``);
	console.error(`Client Error: ${e}`);
});


// when corki is added to a server
global.client.on("guildCreate", async g => {
	guild.owner.createDM.then(dm => dm.send(`Hey, you just added me to ${g.name}. :D
- To set up your server, add features, change behavior, etc. goto corki.js.org/portal?rdr=mod
- To allow mods to do it for you goto corki.js.org/portal?rdr=admin
- For some general info on the bot go to corki.js.org`));

	console.log("Bot added to " + g.name);
});


const welcome = require("./sam/welcome");

// welcome new members to the server
global.client.on("guildMemberAdd", member => {

    // User-defined welcome messages
    welcome.welcomeNewMember(member);

    // TODO: ask new user to `-lol add` accts or sth

});










const token = `${require("fs").readFileSync(`${process.env.HOME}/.corki/disc_key`)}`.trim();

// Log bot in using token
global.client.login(token);

// lol champion mastery-based roles
require("./lol/mastery_roles.js");

// start web portal
require("./web/server.js");
