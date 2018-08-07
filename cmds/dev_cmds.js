
const logCmd = require("../logging.js");

const botAdmins = require("../bot_admins.js");
const mods = require("../sam/mods");

function jsonDump(object) {
    const circularJSON = require("circular-json");
    const fs = require("fs");
    fs.writeFileSync("/tmp/corki.json", circularJSON.stringify(object));
}

module.exports = [

    { // ping

        // returns true if command fits
        condition: msg => msg.content.match(/^-ping/),

        // run to perform command
        act: async msg => {
            logCmd(msg, "-ping'd");
            msg.channel.send(`pong (lag: ${global.client.ping}ms)`);
        },
        tests: [ "ping" ]
    },

    { // generate an error
        condition: msg => msg.content.match(/^-err (.+)/),

        act: async msg => {
            logCmd(msg, "-err'd");
            throw new Error(this.condition(msg)[1]);
        }
    },

    { // expose raw message content
        condition: msg => msg.content.match(/^-deformat (.+)/),
        act: async msg => {
            logCmd(msg, "-deformat'd text");
            msg.channel.send(`\`${this.condition(msg)[1]}\``);
        }
    },

    { // opposite of deformat
        condition: msg => msg.content.match(/^-reformat `(.+)`/),
        act: async msg => {
            logCmd(msg, "-reformat'd text");
            msg.channel.send(this.condition(msg)[1]);
        }
    },

    { // log info
      // useful for getting technical info on things

        condition: msg => msg.content.match(/^\-log (.+)/),

        act: async function (msg) {
            logCmd(msg, "asked for a -log");

            const req = this.condition(msg)[1].split(' ');
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

                } else if (req[0] == "help") {
                    msg.channel.send(logHelpInfo);
                } else if (req[0] == "guild" || req[0] == "server") {
                    if (!msg.guild) {
                        msg.channel.send("command not sent from a guild, try `-log channel` or `-log author`");
                        return;
                    }
                    msg.channel.send(`**Guild Info:**
**id:** ${msg.guild.id}
**name:** ${msg.guild.name}
**members:** ${msg.guild.memberCount}
**created:** ${msg.guild.createdAt}
**joined:** ${msg.guild.joinedAt}
**region:** ${msg.guild.region}
**verification-level:** ${msg.guild.verificationLevel}
**icon:** ${msg.guild.iconURL}`);

                } else {
                    msg.channel.send("error: malformated -log command");
                    msg.channel.send(logHelpInfo);
                }
            else {
                console.log(msg.contents);
            }

        },
        tests: [ "-log channel", "-log guild", "-log author", "-log help" ]

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

            if (msg.author.id == msg.client.user.id)
                return;


            logCmd(msg, "sent a -msg");

            const match = this.condition(msg);
            const channel = match[1];
            const contents = match[2];

            const guild = global.client.channels.get(channel).guild;
            let perms = guild ? mods.getModData(guild.id, msg.author.id) : {
                admin: false, mod: false, mod_cmds: false
            };

            // if they don't have roles priveleges or are a bot then stop them
            if (!botAdmins.auth(msg.author.id) && !guild.members.get(msg.author.id).permissions.has(global.Discord.Permissions.FLAGS.ADMINISTRATOR) && !perms.admin && !perms.mod_cmds) {
                msg.channel.send("You are not authorized to perform this action. \
Ask the server's owner to promote you to admin or grant you access to this command via the web portal\n");
                logCmd(msg, "isn't authorized to use -msg");
                return;
            }

            try {
                msg.guild.channels.find("id", channel).send(contents);
            } catch (e) {
                msg.channel.send("That didn't work.. Probably wrong channel id");
                console.log(e);
                return;
            }

            msg.channel.send("Done!");

        }

    },

    { // bug report
        condition: msg => msg.content.match(/^\-bug (.+)/),
        act: async function (msg) {
            logCmd(msg, `found a -bug: ${this.condition(msg)[1]}`);
            msg.channel.send(`Thank you for the bug report! ${global.client.user} \
is an open-source project, feel free to contribute. https://github.com/dvtate/corki-bot/`);

            botAdmins.sendBugReport(msg, msg.content.match(/^\-bug (.+)/)[1]);
        }
    },

    { // run sh
        condition: msg => msg.content.match(/^\-sys(?:tem)? (.+)/),
        act: async function (msg) {

            // make sure they're authorized
            if (!botAdmins.auth(msg.author.id)) {
                msg.channel.send("You are not authorized to perform this action.\n"
                               + "Ask @ridderhoff#6333 to add you to the botadmins list.");
                logCmd(msg, "isn't authorized to use -msg");
                return;
            }

            const command = this.condition(msg)[1];

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

            const code = this.condition(msg)[1];
            try {
                    eval(code);
            } catch (err) {
                    msg.channel.send(`error: \`\`\`\n${err.stack}\n\`\`\``);
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

        },
        tests: [ "-uptime" ]
    },

    {
        condition: msg => msg.content.match(/^-full-test/),
        act: async msg => {
            if (!botAdmins.auth(msg.author.id))
                return;

            let i = 0
            global.commands.forEach(c => {
                setTimeout(() => {
                    if (c.tests)
                        c.tests.forEach(testMsg =>
                            global.client.channels.get("476246169652035595").send(testMsg));

                }, i += 1000)
            });
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
