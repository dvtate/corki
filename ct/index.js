// System libraries
const fs = require('fs');
const cp = require('child_process');

// Spawn worker bot processes and give them their authentication tokens
let workers = [];
function spawnWorkers() {
    const workerTokens = fs.readFileSync(`${process.env.HOME}/.corki/disc_worker_tokens`).toString().split(',');
    workers = workerTokens.map(token => {
        const worker = cp.fork('worker.js');
        worker.send({ event: 'login', token });
        return worker;
    });
}

/**
 * Expected format of channel_pools.json
 * 
 * [
 *      {
 *          channels: [channel ids for given pool,],
 *          blockedUsers: [list of blocked userIds for pool]
 * ]
 */

// Same format as config file
let config;

// Set of channels to track
let trackingChannels;

// Channel Id -> pool object
const channelToPool = {};

function loadConfig() {
    // Read config file
    config = JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/ct_pools.json`));

    // Load data structures for faster lookups
    let chans = [];
    config.forEach(pool => {
        chans = chans.concat(pool.channels);
        pool.channels.forEach(id => {
            channelToPool[id] = pool;
            channelToPool[id].blockedUsers = new Set(channelToPool[id].blockedUsers);
        });
    });
    trackingChannels = new Set(chans);
}


// 
function processMsg(msg)  {
    if (!trackingChannels.has(msg.channel.id))
        return;
    
    const pool = channelToPool[msg.channel.id];

    // const message = {
    //     originChannelId: msg.channel.id,
    //     embeds: msg.embeds,
    //     text: msg.text,
    //     pool,
    //     guild: {

    //     },
    //     author: {
    //         id: msg.user.id,
    //         username: msg.user.username,
    //         discriminator: msg.user.discriminator,
    //         avatar: msg.user.avatar,
    //         bot: msg.user.bot,
    //     },
    // };

    msg.pool = pool;

    // Send message to the corresponding worker to redistribute
    const worker = workers[Number(msg.id.toString().slice(-3)) % workers.length];
    worker.send({ event: 'dispatch', msg });
}

// 
module.exports = {
    loadConfig, spawnWorkers, processMsg
};