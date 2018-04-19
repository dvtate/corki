

// see file if ur concerned about privacy, its not bad
const logCmd = require("./logging.js");

// Import the discord.js module
const Discord = require("discord.js");

// Create an instance of a Discord client
global.client = new Discord.Client();

// bot will only start reacting to information
// from Discord _after_ ready is emitted
global.client.on("ready", () => {
	console.log("Ready to fly!");
});


const subreddit_fwd = require("./subreddit_forward.js");



// set up our list of commands
var commands = [];
commands = commands.concat(require("./dev_cmds.js"));
commands = commands.concat(require("./basic_cmds.js"));
commands = commands.concat(require("./corki_cmds.js"));
commands = commands.concat(require("./international_cmds.js"));
commands = commands.concat(require("./text_cmds.js"));
commands = commands.concat([subreddit_fwd.command]);
subreddit_fwd.configure(client);

commands = commands.concat(require("./help_cmds.js"));

//commands.concat(require("./.js");

// message event listener
global.client.on('message', msg => {

	// check each possible command
	for (var i = 0; i < commands.length; i++)
		// if it matches, run it
		if (commands[i].condition(msg)) {
			commands[i].act(msg);
			break; // we're done here
		}

});


// Log bot in using token
global.client.login(process.env.DISC_KEY);
