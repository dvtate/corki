
const logCmd = require("./logging.js");

const botAdmins = require("./bot_admins.js");

function jsonDump(object) {
    const circularJSON = require("circular-json");
    const fs = require("fs");
    fs.writeFileSync("/tmp/corki.json", circularJSON.stringify(object));
}

module.exports = [

    { // ping

        // returns true if command fits
        condition: msg => msg.content.match(/^\-ping/),

        // run to perform command
        act: async msg => {
            logCmd(msg, "-ping'd");
            msg.channel.send(`pong (lag: ${global.client.ping}ms)`);
        }
    },

    { // generate an error
        condition: msg => msg.content.match(/^\-err (.+)/),

        act: async msg => {
            logCmd(msg, "-err'd");
            throw new Error(msg.content.match(/^\-err (.+)/)[1]);
        }
    },

    { // log info
      // useful for getting technical info on things

        condition: msg => msg.content.match(/^\-log (.+)/),

        act: async function (msg) {
            logCmd(msg, "asked for a -log");

            const req = msg.content.match(/^\-log (.+)/)[1].split(' ');
            if (req.length == 1)
                if (req[0] == "msg") {
                    console.log(msg);
                    msg.channel.send("msg logged to stdout");

                } else if (req[0] == "channel") {

                    // compile channel info
                    let info = "**channel info:**\n"
                            + `**type:** ${msg.channel.type}\n`
                            + `**id:** ${msg.channel.id}\n`;

                    if (msg.channel.type == 'dm') {
                        info += "**DM user info:**\n"
                            + `\t**id:** ${msg.channel.recipient.id}\n`
                            + `\t**username:** @${msg.channel.recipient.username}#${msg.channel.recipient.discriminator}\n`
                    } else if (msg.channel.type == "text") {
                        info += `**name:** ${msg.channel.name}\n`;
                        info += "**Server/Guild info:**\n"
                            + `\t**id:** ${msg.channel.guild.id}\n`
                            + `\t**name:** ${msg.channel.guild.name}\n`
                    }

                    msg.channel.send(info);

                } else if (req[0] == "author") {

                    const info = "**Author info:**\n"
                        + `**id:** ${msg.author.id}\n`
                        + `**username:** @${msg.author.username}#${msg.author.discriminator}\n`
                        + `**avatar:** https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}`;

                    msg.channel.send(info);

                } else if (req[0] == "msgid") {
                    msg.channel.send(`msg.id = ${msg.id}`);
                } else if (req[0] == "help") {
                    msg.channel.send(logHelpInfo);
                } else {
                    msg.channel.send("error: malformated -log command");
                    msg.channel.send(logHelpInfo);
                }


        }

    },

    { // log help if no args
        condition: msg => msg.content.match(/^\-log(?:$|\s)|^-help log(?:$|\s)/),
        act: async function (msg) {
            msg.channel.send(logHelpInfo);
        }
    },


    { // msg - send a message to a channel
        condition: msg => msg.content.match(/^\-msg (\S+) ([\s\S]+)/),
        act: async function (msg) {
            if (!botAdmins.auth(msg.author.id)) {
                msg.channel.send("You are not authorized to perform this action.\n"
                               + "Ask @ridderhoff#6333 to add you to the botadmins list.");
                logCmd(msg, "isn't authorized to use -msg");
                return;
            }

            logCmd(msg, "sent a -msg");

            const match = msg.content.match(/\-msg (\S+) ([\s\S]+)/)
            const channel = match[1];
            const contents = match[2];

            try {
                global.client.channels.find("id", channel).send("via -msg: " + contents);
            } catch (e) {
                msg.channel.send("that didn't work.. probably wrong channel id");
                console.log(e);
                return;
            }
            msg.channel.send("Done!");

        }

    },

    { // bug report
        condition: msg => msg.content.match(/^\-bug (.+)/),
        act: async function (msg) {
            logCmd(msg, `found a -bug: ${msg.content.match(/^\-bug (.+)/)[1]}`);
            msg.channel.send(`Thank you for the bug report! ${global.client.user} \
is an open-source project, feel free to contribute. https://github.com/dvtate/corki-bot/`);

            botAdmins.sendBugReport(msg.content.match(/^\-bug (.+)/)[1]);

        }
    },

    { // run sh
        condition: msg => msg.content.match(/^\-system (.+)/),
        act: async function (msg) {
            // make sure they're authorized
            if (!botAdmins.auth(msg.author.id)) {
                msg.channel.send("You are not authorized to perform this action.\n"
                               + "Ask @ridderhoff#6333 to add you to the botadmins list.");
                logCmd(msg, "isn't authorized to use -msg");
                return;
            }

            const command = msg.content.match(/^\-system (.+)/)[1];

            // run command and send output
            require("child_process")
                .exec(command,
                    (error, stdout, stderr) =>
                        msg.channel.send(`corki@roflcopter $ ${command}\n\`\`\`
${stdout}\n\`\`\`\n::${stderr}\n::${error}`));
        }
    },

    { // eval
      // instead of making a new command just use -eval :S
        condition: msg => msg.content.match(/^\-eval ([\s\S]+)/),
        act: async function (msg) {

            // make sure they're authorized
            if (!botAdmins.auth(msg.author.id)) {
                msg.channel.send("You are not authorized to perform this action.\n"
                               + "Ask @ridderhoff#6333 to add you to the botadmins list.");
                logCmd(msg, "isn't authorized to use -eval");
                return;
            }

            const code = msg.content.match(/^-eval ([\s\S]+)/)[1];
            try {
                    eval(code);
            } catch (err) {
                    msg.channel.send(`error: ${err}`);
            }

        }

    },

    { // how long has the bot been running?
        start_time: process.hrtime(),

        condition: msg => msg.content.match(/^-uptime(?:$|\s)/),

        act: async function (msg) {
            logCmd(msg, "checked -uptime");

            let time = process.hrtime(this.start_time);
            const ns_per_s = 1e9;
            time = (time[0] * ns_per_s + time[1]) / (ns_per_s);

            msg.channel.send(`Corki Bot has been online for \
${Math.floor(time / 60 / 60 / 24)} days, ${Math.floor(time / 60 / 60) % 24
} hours, ${Math.floor(time / 60) % 60} minutes, and ${time % 60} seconds and counting`);

        }
    }
];



const logHelpInfo = { embed: {
    title: "-log Help",
    description: "`-log` is a multi-purpose command used to help the bot developers by giving useful information",
    fields: [
        {
            name: "Possble arguments",
            value: `You must specify what information you want.
    \`-log help\`: send this help entry.
    \`-log msg\`: writes a message to the terminal (of little use).
    \`-log channel\`: describe current channel.
    \`-log author\`: describe whoever sends this command.
    \`-log msgid\`: send id of command message.`
        }
    ]
}};
