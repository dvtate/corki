

// list of people who are trustworthy of not breaking my server
const botAdmins = [ "253784341555970048",   // @ridderhoff#6333
                    "186157998538883092",   // @fsm
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
        global.client.channels.get(bugReportChannel)
            .send(`@${msg.author.username}#${msg.author.discriminator} found a bug(${msg.content}): ${bug}`);
    else
        global.client.channels.lget(bugReportChannel)
            .send(`untraced error: ${bug}`);
}
