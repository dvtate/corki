
// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();



// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('Ready to fly!');
});

// Create an event listener for messages
client.on('message', message => {
  // If the message is "ping"
  if (message.content.match(/\/ping/)) {
    // Send "pong" to the same channel
    message.channel.send('pong');
  }
});


// Log our bot in
client.login(process.env.DISCORD_TOKEN);
