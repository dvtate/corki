/// This file is dedicated to the management and improvement of the bot
///

// list of people who are trustworthy of not breaking my server
const botAdmins = [ "253784341555970048",   // @ridderhoff#6333
                    "186157998538883092",   // @fsm#
                  ];

// export list
module.exports.list = botAdmins;

// is given user trustworthy
module.exports.auth = id => botAdmins.includes(id);


const root = [ "253784341555970048" ]; // @ridderhoff

// feel free to join the server btw: https://discord.gg/cXcXSmy
const bugReportChannel = "455415485173858318";
module.exports.bugReportChannel = bugReportChannel; // atest server:botstuff#bugs


module.exports.sendBugReport = async (msg, bug) => {
    if (msg)
        (await global.client.channels.fetch(bugReportChannel))
            .send(`@${msg.author.username}#${msg.author.discriminator} found a bug(${msg.content}): ${bug}`);
    else
        (await global.client.channels.fetch(bugReportChannel))
            .send(`untraced error: ${bug}`);
}

module.exports.bug = bug => module.exports.sendBugReport(null, bug);


module.exports.joinGuild = async g => {
    if (g.owner) g.owner.createDM().then(dm => dm.send(`Hey, you just added me to ${g.name}. :D
- To set up your server, add features, change behavior, etc. goto https://corki.js.org/portal?rdr=mod
- To allow admins/mods to do it for you goto https://corki.js.org/portal?rdr=admin
- For some general info on the bot go to https://corki.js.org`)).catch(console.error);
    console.log(`Guild joined: ${g.name}#${g.id}`);

    (await global.client.channels.fetch("566432610532982804")).send({ embed: {
        title: "Added to Guild",
        description: `${global.client.user} was added to ${g.name}#${g.id} :D`,
        fields: [
            {
                name: "Servers",
                value: global.client.guilds.cache.size,
                inline: true,
            }, {
                name: "Users Gained",
                value: g.memberCount,
                inline: true,
            }, {
                name: "Total Users",
                value: usersCount(),
                inline: true,
            }
        ]
    }});
};


module.exports.leaveGuild = async g => {
    try {
	console.log(`Guild deleted/left: ${g.name}#${g.id}`, g);
	if (!g.name) {
		console.log(g);
		return;
	}
	if (g.owner) g.owner.createDM().then(dm => dm.send(`
I'm not sure what happened to ${g.name}. If the server was deleted you can \
disregard this message. If you no longer need corki bot in your server \
that's fine too. If you could please send a \`-bug\` report (or contact @ridderhoff#6333) giving some \
pointers on any ideas on how to improve the bot, that would be amazing!`))
		.catch(console.error);

	(await global.client.channels.fetch("566432610532982804")).send({ embed: {
		title: "Removed from giuld",
		description: `${global.client.user} was removed from ${g.name}#${g.id} :(`,
		fields: [
			{
				name: "Servers",
				value: global.client.guilds.cache.size,
				inline: true,
			}, {
				name: "Users Lost",
				value: g.memberCount,
				inline: true,
			}, {
                name: "Total Users",
                value: usersCount(),
                inline: true,
            }
		],
	}});
    } catch(e) {console.error(e);}

}

function usersCount() {
    return global.client.guilds.cache.array()
        .map(g => g.memberCount)
        .reduce((accum, v) => accum + v);
}
module.exports.usersCount = usersCount;
