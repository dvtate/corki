

// list of people who are trustworthy of not breaking my server
const botAdmins = [ "253784341555970048",   // @ridderhoff
                    "186157998538883092",   // @fsm
                    "182591843584704522",   // @silverwood
                    "126008190067408897",   // @yon g
                  ];

// export list
module.exports.list = botAdmins;

// is given user trustworthy
module.exports.auth = id => botAdmins.includes(id);


const root = [ "253784341555970048" ]; // @ridderhoff


// feel free to join server btw: https://discord.gg/cXcXSmy
module.exports.bugReportChannel = "455415485173858318"; // atest/botstuff#bugs

module.exports.sendBugReport = async (msg, bug) =>
                global.client.channels.find("id", this.bugReportChannel)
                    .send(`@${msg.author.username}#${msg.author.discriminator} found a bug(${msg.content}): ${bug}`);
