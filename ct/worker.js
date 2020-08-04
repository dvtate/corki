
// Import the discord.js module
const Discord = require("discord.js");

// Create an instance of a Discord client
const client = new global.Discord.Client();

/* We save messages sent to these caches so that if the message 
   gets deleted in one channel we can delete the other copies

   Both have same schema, but we limit number of messages in messageCache for performance
*/
let chatHistory = [];
let messageCache = [
/*
    {
        msgs: [message ids]
        ts: epoch ms
    }
*/
];

// Clean cache
setInterval(() => {
    const PERFORMANCE_CACHE_DURATION = 1000 * 60 * 5;
    const TOTAL_DELETION_WINDOW = 1000 * 60 * 60 * 24;
    
    // Remove messages more than one day old
    let oldMessages = 0;
    while (chatHistory[oldMessages] - Date.now() > TOTAL_DELETION_WINDOW)
        oldMessages++;
    chatHistory.splice(0, oldMessages);

    // Move old messages out of the cache
    let pivot = messageCache.findIndex(msg => Date.now - msg.ts < PERFORMANCE_CACHE_DURATION);
    chatHistory = chatHistory.concat(messageCache.splice(0, pivot))
}, 1000 * 60 * 4);


// Send message to relevant channels
async function dispatch(msg) {
    const { pool } = msg;
    const nick = `${msg.user.username} - ${msg.guild.name}`;
    const name = `Worker #${msg.id.toString().slice(-1)}`;

    // Distribute to relevant channels
    const messages = await Promise.all(pool.channels
        .filter(c => c !== msg.channel.id)
        .map(async id => {
            // Send message to channel, mocking original user
            const channel = client.channels.get(id);
            await channel.guild.members.get(client.user.id).setNickname(nick);
            await channel.send(msg.contents, { embed: msg.embeds[0] });
            await channel.guild.members.get(client.user.id).setNickname(name);
        })
    );
    messages.push(msg);

    // Cache them
    messageCache.push({
        ts: Date.now(),
        msgs: messages.map(m => m.id),
    });
}


// Handle IPC
process.on('message', msg => {
    if (msg.event === 'dispatch') {
        dispatch(msg.message);
    } else if (msg.event === 'login') {
        client.login(msg.token);
        console.log('spawned worker... awaiting commands');
    }
});