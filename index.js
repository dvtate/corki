const logCmd = require("./logging.js");
const fs = require("fs");
// Import the discord.js module
global.Discord = require("discord.js");

// Create an instance of a Discord client
global.client = new global.Discord.Client();


// bot will only start reacting to information
// from Discord _after_ ready is emitted
global.client.on("ready", () => {
	console.log("Ready to fly!");
	// in case of wanting to broadcast more: "corki.js.org | @Corki help \n                          \nPortal - corki.js.org/portal"
	global.client.user.setActivity("corki.js.org | @ me for help", {
		game: {
			url: "https://corki.js.org",
			type: 0
		}
	}).catch(console.error);

	// spawn daemons:

		// start web portal server
	global.daemon_portal_server = require("./web/server.js");

		// start auto-roles daemon
	global.daemon_auto_roles = require("./sam/auto_roles/daemon.js");

	const DBL = require("dblapi.js");

	try {
		const dbl_token = fs.readFileSync(`${process.env.HOME}/.corki/dbl_api_key`).toString().trim();
		global.dbl = new DBL(dbl_token, global.client);
		// Optional events
		global.dbl.on('posted', () => {
			//console.log('DBL server count posted!');
		});

		global.dbl.on('error', e => {
			//console.log(`discorbotslist error! ${e}`);
		});

	} catch (e) {
		console.log("DBL failed " + e);
	}

});


// set up our list of commands
global.commands = []
	.concat(require("./cmds/dev_cmds"))
	.concat(require("./cmds/basic_cmds"))
	.concat(require("./cmds/international_cmds"))
	.concat(require("./cmds/text_cmds"))
	.concat(require("./sam/roles_cmds"))
	.concat(require("./sam/welcome"))
	.concat(require("./lol/lol_commands"))
	.concat(require("./lol/champgg_commands"))
	.concat(require("./lol/lb_cmds"))
	.concat(require("./rss/rss_cmds"))
	.concat(require("./sam/prefix_cmds"))
	.concat(require("./cmds/define"))
	.concat(require("./cmds/help_cmds"))
	.concat(require("./sam/blacklist_cmds"));

//
const interactions = []
	.concat(require("./reactions"));


const bl = require("./sam/blacklist"); // should ignore msgs in certan servers/channels
const prefix = require("./sam/prefix"); // respond to different commands in dfferent severs
const bot_admins = require("./bot_admins"); // bot owner auth & meta stuff
const ct = require('./ct'); // Cross-guild-communication

// message event listener
global.client.on("message", async msg => {
	if ((msg.guild && bl.guilds().includes(msg.guild.id)) || bl.chans().includes(msg.channel.id))
		return;

       // discord no longer sends messages not directed at the bot and this at least lets me debug easier (doesn't include usernames)
       if (msg.content)
               fs.appendFile(
                     process.env.HOME + '/.corki/msglog.txt',
                     msg.content + '\n',
                     err => err && console.error('msglog err: ', err));

	// check for prefix
	const prefixes = [ `<@${global.client.user.id}>`, `<@!${global.client.user.id}>` ] // mention
		.concat(msg.guild ? prefix.getGuildPrefixes(msg.guild.id) : [ '-' ]);

	// performance for this is O(N) :(

	// check to see if it has a relevant prefix
	for (let i = 0; i < prefixes.length; i++)
		// if it does, try to find the command
		if (msg.content.match(new RegExp('^' + prefixes[i]))) {
			msg.content = msg.content.replace(new RegExp('^' + prefixes[i]), "").trim();
			// check each possible command
			for (let i = 0; i < commands.length; i++)
				// if it matches, run it
				if (commands[i].condition(msg)) {
					commands[i].act(msg)
						.catch(e => {
							msg.channel.send(`Sorry, that errored. If there's anything you would like to add, send a \`-bug\` report\n\`\`\`\n${e.stack}\n\`\`\``);
							bot_admins.sendBugReport(msg, ` Error:\n\`\`\`\n${e.stack}\n\`\`\``);

						});
					break; // we're done here
				}
			break;
		}

	// special interactions can come from any message
	// ie - if somoene says something bad about corki he reacts w/ question mark
	interactions.forEach(i => {
		if (i.condition(msg))
			i.act(msg).catch(e => bot_admins.sendBugReport(msg,
				 `Interaction Error:\n\`\`\`\n${e.stack}\n\`\`\``));
	});


});

// something broke
global.client.on("error", async e => {
	bot_admins.sendBugReport(null, `Client Error:\n\`\`\`\n${e.stack || e.message || e}\n\`\`\``);
	console.error("Client Error:", e);
});

// when corki is added to a server give server owner a quick intro
global.client.on("guildCreate", bot_admins.joinGuild);

// when corki is removed from server, try to ask owner why (only works if they're in a mutual server)
global.client.on("guildDelete", bot_admins.leaveGuild);

const welcome = require("./sam/welcome");



// welcome new members to a server
global.client.on("guildMemberAdd", member => {

    // User-defined welcome messages
    welcome.welcomeNewMember(member);

    // TODO: ask new user to `-lol add` accts or sth (if desired by mods)

});


const token = fs.readFileSync(`${process.env.HOME}/.corki/disc_key`).toString().trim();

// Log bot in using token
global.client.login(token);
