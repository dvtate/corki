
// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();


// bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
	console.log('Ready to fly!');
});

// Create an event listener for messages
client.on('message', msg => {
	
	// If the message is "ping"
	if (msg.content.match(/_ping/)) {
		// Send "pong" to the same channel
		msg.channel.send('pong');

	} else if (message.content.match(/_coinflip/)) {
		if (Math.random() < 0.5)
			msg.channel.send('heads');
		else
			msg.channel.send('tails');
	}
});

// Log our bot in
client.login(process.env.DISCORD_TOKEN);
