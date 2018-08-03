
const fs = require("fs");

const logCmd = require("../logging");
const sam = require("./sam")



// welcome new members to the server
global.client.on("guildMemberAdd", member => {


	if (fs.existsSync(`${process.env.HOME}/.corki/servers/${member.guild.id}/announce_new_members.json`)) {
		chans = JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${member.guild.id}/announce_new_members.json`));
		console.log(member.guild);
		chans.forEach(c => global.client.channels.get(c).send(`Welcome to ${member.guild.name}, ${member}!`));
	}


});



module.exports = [

    {
        condition: (msg) => msg.content.match(/^-announce-new-members/),
        act: async (msg) => {
			console.log("anm.");

			sam.makeServerDir(msg.guild.id);

            let chans = [];
            if (fs.existsSync(`${process.env.HOME}/.corki/servers/${msg.guild.id}/announce_new_members.json`))
                chans = JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${msg.guild.id}/announce_new_members.json`));

            chans.push(msg.channel.id);

            fs.writeFileSync(`${process.env.HOME}/.corki/servers/${msg.guild.id}/announce_new_members.json`, JSON.stringify(chans));

            msg.channel.send("New members will be welcomed here");
        }

    }, {
        condition: (msg) => msg.content.match(/^-ignore-new-members/),
        act: async (msg) => {
            // go ahead and make a server directory, doesnt hurt anything
			sam.makeServerDir(msg.guild.id);

            // if they have new-message forwarding enabled
            if (fs.existsSync(`${process.env.HOME}/.corki/servers/${msg.guild.id}/announce_new_members.json`)) {
                // list of channels to forward new member announcement to
                let chans = JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${msg.guild.id}/announce_new_members.json`));
                // remove this channel from list
                chans = chans.filter(c => c != msg.channel.id);
                // write to file
                fs.writeFileSync(`${process.env.HOME}/.corki/servers/${msg.guild.id}/announce_new_members.json`,
                                 JSON.stringify(chans));
            }

            msg.channel.send("New Members will not be welcomed here");

        }


    }

]
