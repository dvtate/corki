

// list of people who are trustworthy of not breaking my server
const botAdmins = [ "253784341555970048",   // @ridderhoff
                    "186157998538883092",   // @fsm
                    "126008190067408897",   // @yon g
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
    if (msg) {
        global.client.channels.get(bugReportChannel)
            .send(`@${msg.author.username}#${msg.author.discriminator} found a bug(${msg.content}): ${bug}`);
    } else {
        global.client.channels.find.get(bugReportChannel)
            .send(`untraced error: ${bug}`);
    }
}
