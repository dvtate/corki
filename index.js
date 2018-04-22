

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


// set up our list of commands
var commands = [];
commands = commands.concat(require("./dev_cmds.js"));
commands = commands.concat(require("./basic_cmds.js"));
commands = commands.concat(require("./international_cmds.js"));
commands = commands.concat(require("./text_cmds.js"));


const subreddit_fwd = require("./subreddit_forward.js");
commands = commands.concat(subreddit_fwd.commands);
subreddit_fwd.configure();

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

// Create an event listener for new guild members
global.client.on("guildMemberAdd", member => {

    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find("name", "member-log");

    // Do nothing if the channel wasn't found on this server
    if (!channel) return;

    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);

    console.log(`new member: ${member}`);

});

const token = `${require("fs").readFileSync(`${process.env.HOME}/.corki/disc_key`)}`.trim();

// Log bot in using token
global.client.login(token);
