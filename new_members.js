

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
