
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
        condition: msg => msg.content.match(/^ping/),

        // run to perform command
        act: async msg => {
            logCmd(msg, "-ping");
            msg.channel.send(`pong (lag: ${global.client.ping}ms)`);
        },
        tests: [ "-ping" ]
    },

    { // generate an error
        condition: msg => msg.content.match(/^err (.+)/),

        act: async function (msg) {
            logCmd(msg, "-err ()");
            throw new Error(this.condition(msg)[1]);
        }
    },

    { // expose raw message content
        condition: msg => msg.content.match(/^deformat (.+)/),
        act: async function (msg) {

            logCmd(msg, "-deformat ()");
            msg.channel.send(`\`${this.condition(msg)[1]}\``);
        },
        tests: [ "-deformat <@253784341555970048>"]
    },

    { // opposite of deformat
        condition: msg => msg.content.match(/^reformat `(.+)`/),
        act: async function (msg) {
            logCmd(msg, "-reformat ()");
            msg.channel.send(this.condition(msg)[1]);
        },
        tests: [ "-reformat `<@253784341555970048>`" ]
    },

    {
        condition: msg => msg.content.match(/^emote (\S+)/),
        act: async function (msg) {
            logCmd(msg, "-emote () ()");
            msg.channel.send(`<:E:${this.condition(msg)[1]}>`);
        },
        tests: [ "-emote 440285536498876436" ]
    },

    {
        condition: msg => msg.content.match(/^emote-react (\S+) (\S+)/),
        act: async function (msg) {
            logCmd(msg, "-emote-react () ()");
        }
    },

    {
        condition: msg => msg.content.match(/^log channel/),
        act: msg => {
            let info = { embed: {
                title: "Channel info",
                fields: [
                    {
                        name: "Type",
                        value: msg.channel.type,
                        inline: true
                    }, {
                        name: "ID",
                        value: msg.channel.id,
                        inline: true
                    }
                ]
            }};

            if (msg.channel.type == "dm")
                info.embed.fields = info.embed.fields.concat([
                    {
                        name: "DM User ID",
                        value: msg.channel.recipient.id,
                        inline: true
                    }, {
                        name: "DM Username",
                        value: `@${msg.channel.recipient.username}#${msg.channel.recipient.discriminator}`,
                        inline: true
                    }
                ]);
            else if (msg.channel.type == "text")
                info.embed.fields = info.embed.fields.concat([
                    {
                        name: "Name",
                        value: `#${msg.channel.name}`,
                        inline: true
                    }, {
                        name: "Guild ID",
                        value: msg.channel.guild.id,
                        inline: true
                    }, {
                        name: "Guild Name",
                        value: msg.channel.guild.name,
                        inline: true
                    }
                ]);


            msg.channel.send(info);

        }
    },

    {
        condition: msg => msg.content.match(/^(?:log author|avatar)(?:\s?<@!?([0-9]+)>)?/),
        act: function (msg) {
            const m = this.condition(msg);
            const user = m[1] ? global.client.users.get(m[1]) : msg.author;
            msg.channel.send({ embed: {
                title: `@${user.username}#${user.discriminator}`,
                description: `${user} has user ID ${user.id}`,
                image: { url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}` }
            }});
        }, tests: [ "-log author" , "-avatar <@253784341555970048>" ]
    },


    {
        condition: msg => msg.content.match(/^log guild/),
        act: msg => {
            if (!msg.guild)
                return msg.channel.send("command not sent from a guild, try `-log channel` or `-log author`");

            msg.channel.send({ embed: {
                title: msg.guild.name,
                description: `${global.client.user} has been in this server since ${msg.guild.joinedAt}.`,
                fields: [
                    {
                        name: "ID",
                        value:  msg.guild.id,
                        inline: true
                    }, {
                        name: "Members",
                        value: `${msg.guild.memberCount} total`,
                        inline: true
                    }, {
                        name: "Created",
                        value: msg.guild.createdAt,
                        inline: true
                    }, {
                        name: "Region",
                        value: msg.guild.region,
                        inline: true
                    }, {
                        name: "Verification Level",
                        value: msg.guild.verificationLevel,
                        inline: true
                    }, {
                        name: "Roles",
                        value: msg.guild.roles.array().map(r => `\`${r.name}\`: ${r.id}`).join('\n').substr(0, 1000),
                    }, {
                        name: "Emojis",
                        value: msg.guild.emojis.array().map(e => `${e} - \`<:${e.name}:${e.id}>\``).join('\n').substr(0, 1000),
                    }
                ],
                thumbnail: { url: msg.guild.iconURL }
            }});
        },
        tests: [ "-log guild" ]
    },

    {
        condition: msg => msg.content.match(/^log members/),
        act: async msg => {
            if (!msg.guild)
                return msg.channel.send("`-log members` is only available for guilds");

            // just in case 250+ members
            msg.guild.fetchMembers().then(guild => {

                const members = Array.from(guild.members);
                const bot_members = members.filter(m => m[1].user.bot).length;
                const humans = guild.memberCount - bot_members;
                const online = members.filter(m => m[1].user.presence.status != "offline").length;
                const available = members.filter(m =>
                    m[1].user.presence.status == "online" || m[1].user.presence.status == "idle")
                        .length;


                msg.channel.send({ embed: {
                    fields: [
                        {
                            name: "Total",
                            value: guild.memberCount,
                            inline: true
                        }, {
                            name: "Human",
                            value: humans,
                            inline: true
                        }, {
                            name: "Bots",
                            value: bot_members,
                            inline: true
                        }, {
                            name: "Online",
                            value: online,
                            inline: true
                        }, {
                            name: "Available",
                            value: available,
                            inline: true
                        }
                    ]
                }});

            });

        },
        tests: [ "-log members" ]
    },

    { // msg - send a message to a channel
        condition: msg => msg.content.match(/^msg (\S+) ([\s\S]+)/),
        act: async function (msg) {

            if (msg.author.id == msg.client.user.id)
                return;


            logCmd(msg, "-msg () ()");

            const match = this.condition(msg);
            const channel = match[1];
            const contents = match[2];

            const chan = global.client.channels.get(channel);
            if (!chan)
                return msg.channel.send("Invalid Channel. (Corki must be mutual member of server)");


            const guild = chan.guild;
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
                global.client.channels.get(channel).send(contents);
            } catch (e) {
                msg.channel.send("That didn't work.. Probably wrong channel id");
                console.log(e);
                return;
            }

            msg.react("👍");

        }

    },

    { // bug report
        condition: msg => msg.content.match(/^bug (.+)/),
        act: async function (msg) {
            logCmd(msg, `found a -bug: ${this.condition(msg)[1]}`);
            msg.channel.send(`Thank you for the bug report! ${global.client.user} \
is an open-source project, feel free to contribute. https://github.com/dvtate/corki-bot/`);

            botAdmins.sendBugReport(msg, this.condition(msg)[1]);
        }
        //tests: [ "-bug disregard this bug report. This is part of corki bots automated testing system" ]
    },

    { // run sh
        condition: msg => msg.content.match(/^sys(?:tem)? (.+)/),
        act: async function (msg) {

            // make sure they're authorized
            if (!botAdmins.auth(msg.author.id)) {
                msg.channel.send("You are not authorized to perform this action.\n"
                               + "Ask @ridderhoff#6333 to add you to the botadmins list.");
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
        condition: msg => msg.content.match(/^eval ([\s\S]+)/),
        act: async function (msg) {
            logCmd(msg, "-eval ()");

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

            msg.react("👍");
        }

    },

    { // how long has the bot been running?
        start_time: process.hrtime(),

        condition: msg => msg.content.match(/^uptime(?:$|\s)/),

        act: async function (msg) {
            logCmd(msg, "-uptime");

            let time = process.hrtime(this.start_time);
            const ns_per_s = 1e9;
            time = (time[0] * ns_per_s + time[1]) / (ns_per_s);


            const ms_to_str = ms => `${Math.floor(ms / 1000 / 60 / 60 / 24)} days, ${
                Math.floor(ms / 1000 / 60 / 60) % 24} hours, ${Math.floor(ms / 1000 / 60) % 60
                } minutes, and ${Math.round(((ms / 1000) % 60) * 1000) / 1000} seconds`;

            let srv_uptime = await new Promise((resolve, reject) =>
                // run command and send output
                require("child_process")
                    .exec("uptime",
                        (error, stdout, stderr) => {
                            resolve(error ? "undefined" : stdout);
                        }));


            msg.channel.send({ embed: {
                title: "Uptime",
                description: "Corki must be restarted in order to apply updates. Although some outages are planned/expected the majority are a result of Cox Cable Co.",
                fields: [
                    {
                        name: "Server Uptime",
                        value: srv_uptime,
                    }, {
                        inline: true, name: "Bot Uptime",
                        value: ms_to_str(time * 1000),
                    }, {
                        inline: true, name: "Last Outage",
                        value: `${ms_to_str(global.client.uptime)} ago`,
                    }
                ]
            }})

        },
        tests: [ "-uptime" ]
    },

    {
        condition: msg => msg.content.match(/^full-test/),
        act: async msg => {
            if (!botAdmins.auth(msg.author.id))
                return;

            logCmd(msg, "-full-test");

            // 1 command per second hopefully
            let i = 0
            global.commands.forEach(c => {
                setTimeout(() => {
                    if (c.tests)
                        c.tests.forEach(testMsg =>
                            msg.channel.send(testMsg));

                }, i += 1000)
            });
        }
    },

    {
        condition: msg => msg.content.match(/^(?:about|log bot)/),
        act: async msg => {
            logCmd(msg, "-about");

            let version = await new Promise((resolve, reject) =>
                // run command and send output
                require("child_process")
                    .exec("git log -1 --pretty=format:\"%h (%s)\"",
                        (error, stdout, stderr) => {
                            resolve(error ? "undefined" : stdout);
                        }));

            const formatUptimeSecs = (time) => `${Math.floor(time / 60 / 60 / 24)}d ${Math.floor(time / 60 / 60) % 24
    }h, ${Math.floor(time / 60) % 60}m, and ${Math.round(time % 60)}s`;


            msg.channel.send({ embed: {
                title: "About Corki",
                description: `${global.client.user.toString()
} is an [free](https://github.com/dvtate/corki/blob/master/LICENCE) Discord bot designed with a wide variety of use cases in mind.\
 The bot is community driven and [feature requests](https://feathub.com/dvtate/corki) are openly welcomed.`,

                fields: [
                    {
                        name: "Version",
                        value: `Corki is on a roling release system.
- The currently running patch is ${version}`
                    }, {
                        name: "Severs",// for each rule
                        value: global.client.guilds.array().length,
                        inline: true
                    }, {
                        name: "Channels",
                        value: global.client.channels.array().length,
                        inline: true
                    }, {
                        name: "Users",
                        value: botAdmins.usersCount(),
                        inline: true
                    }, {
                        name: "Memory",
                        value: Math.round(process.memoryUsage().rss / 1000) / 1000 + "mb",
                        inline: true
                    }, {
                        name: "Corki Uptime",
                        value: formatUptimeSecs(process.uptime()),
                        inline: true
                    }, {
                        name: "Server Uptime",
                        value: formatUptimeSecs(require("os").uptime),
                        inline: true
                    }
                ]

            }})
        },
        tests: [ "-about" ]
    },

    {
        condition: msg =>  msg.content.match(/^log/),
        act: msg => msg.channel.send({ embed: {
            title: "-log Help",
            description: "`-log` is a multi-purpose command used to help the bot developers by giving useful information",
            fields: [
                {
                    name: "Possble arguments",
                    value: `You must specify what information you want.
            \`-log\`: send this help entry.
            \`-log guild\`: send information about the current server
            \`-log members\`: send membership information for current server
            \`-log channel\`: describe current channel.
            \`-log author\`: describe whoever sends this command.
            \`-log bot\`: describe ${global.client.user.toString()}`
                }
            ]
        }}),
        tests: [ "-log help", "-log" ]
    },

    // show image from feathub
    {
        condition: msg => msg.content.match(/^feature-request/),
        act: async msg => {
            logCmd(msg, "-feature-request");


            require("child_process").execSync(
                "wget https://feathub.com/dvtate/corki?format=svg -O /tmp/corki.svg" // get feathub summary
                 + " && convert /tmp/corki.svg /tmp/corki.png");                    // convert to png (imagemagick)

            msg.channel.send({
                embed: {
                    title: "Feature Requests",
                    description: `${global.client.user} is under constant development. \
If you know JavaScript you can help with code on [GitHub](https://github.com/dvtate/corki), \
Otherwise you can submit feature requests on [FeatHub](https://feathub.com/dvtate/corki) and bug \
reports via \`-bug\`. Thanks!`,
                    image: { url: "attachment://feature_requests.png" },
                    files: [{
                        attachment: "/tmp/corki.png",
                        name: "feature_requests.png"
                    }]
                }
            })
        },
        tests: [ "-feature-requests" ]
    }, {
        condition: msg => msg.content.match(/^ar-condition (.+)/),
        act: async function (msg) {
            const cond = this.condition(msg)[1];
            const ar = require("../sam/auto_roles/condition");
            const gid = msg.guild.id;
            msg.channel.send(await ar.parseCondition(msg.guild.id, msg.author.id, cond));
        }

    }
];
