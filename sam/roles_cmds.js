const roles = require("./roles");


module.exports = [
    { // mod add roles

        condition: msg => msg.content.match(/^-add-(?:ssignable-roles?|sar) (.+)/),

        act: async function (msg) {

            if (msg.author.bot)
                return;

            logCmd(msg, "added a self-assignable role");

            let perms = mods.getModData(msg.guild.id, msg.author.id);

            // if they don't have roles priveleges or are a bot then stop them
            if (!msg.guild.members.get(msg.author.id).permissions.has(global.Discord.Permissions.FLAGS.MANAGE_ROLES) && !perms.admin && !perms.mod_cmds) {
                msg.channel.send("You are not authorized to use this command here");
                return;
            }

            this.condition(msg)[1] // find roles argument
                    .split(",")                         // take each role (separated by commas)
                        .map(r => r.trim())             // trim whitespace
                            .forEach(r => roles.addRole(r, msg.guild.id)); // add the roles

            msg.channel.send("Done!");
        }
    },
    { // make roles unassignable again
        condition: msg => msg.content.match(/^-reset-(?:ssignable-roles?|sar)/),
        act: async (msg) => {

            // if they don't have roles priveleges or are a bot then stop them
            if (!msg.guild.members.get(msg.author.id).permissions.has(global.Discord.Permissions.FLAGS.MANAGE_ROLES) || msg.author.bot) {
                msg.channel.send("You are not authorized to use this command here");
                return;
            }

            roles.resetRoles(msg.guild.id);

            msg.channel.send("Done!");

        }
    },

    { // self assign role
        condition: msg => msg.content.match(/^-iam (.+)/),

        act: async function (msg) {

            logCmd(msg, "added a role via -iam");

            // designated self assignable roles for server
            const serverRoles = roles.getRoles(msg.guild.id);

            let roles = this.condition(msg)[1]  // find roles argument
                    .split(',')                 // take each role (separated by commas)
                        .map(r => r.trim());    // trim whitespace

            // verify the roles are valid
            for (let i = 0; i < roles.length; i++)
                if (!serverRoles.includes(roles[i])) {
                    msg.channel.send(`Invalid role "${roles[i]}"`);
                    return;
                }

            // map each role to its coresponding id
            roles.map(r => msg.guild.roles.find("name", r))
                // give user each of the roles they asked for
                .forEach(r => msg.member.addRole(r).catch(console.error));

            msg.channel.send("done!");


        }

    },

    { // list roles
        condition: msg => msg.content.match(/^-(?:roles|iam)(?:$|\s)/),

        act: async function (msg) {
            logCmd(msg, "checked available -roles");
            let sar = roles.getRoles(msg.guild.id);
            if (roles.length == 0)
                msg.channel.send(`This server doesn't have any self-assignable roles.
A moderator can configure them using \`-add-sar\`.
After that point they can be added via \`-iam\``)
            else
                msg.channel.send(`Self-assignable roles on this server: ${sar.join(", ")}
To self-assign a role you can use the command \`-iam <role>\``);
        }
    },

    { // remove role
        condition: msg => msg.content.match(/^-iamnot (.+)/),

        act: async function (msg) {
            let roles = this.condition(msg)[1]  // find roles argument
                    .split(",")                 // take each role (separated by commas)
                        .map(r => r.trim());    // reomve excess whitespace


            // designated self assignable roles for server
            const serverRoles = roles.getRoles(msg.guild.id);

            roles.forEach(role => {
                const r = msg.guild.roles.find("name", role);
                if (!r || !serverRoles.includes(role))
                    msg.channel.send(`invalid role "${role}" ignored`);
                else
                    msg.member.removeRole(r).catch(console.error);
            });

            msg.channel.send("done!");

        }
    },


];

const rolesHelpInfo = { embed: {
        title: "Roles",
        description: "Use the bot to set your roles on the server!",
        fields: [
            {
                name: "Skins",
                value: "If you want a [colorful name](https://raw.githubusercontent.com/dvtate/dvtate.github.io/master/dls/perm/corki-roles.png) \
you should use `-iam` to set your skin to one of the following: \
Urfrider, Arcade, Dragonwing, Ice Toboggan, Red Baron, Hot Rod, Fnatic, UFO"
            }, {
                name: "Regions",
                value: "You can also use `-iam` to specify your region. The following are supported: \
TR, RU, OCE, LAS, LAN, KR, JP, BR, EUNE, NA, EUW"
            }, {
                name: "Example",
                value: `
I just joined the serer so I'll set my roles now. I play in NA and like the color green.
\`-iam NA, UFO\`

I decided to move to Brazil so I'll change my region.
\`-iamnot NA\`
\`-iam BR\``
            }
        ],

        thumbnail: {
            url: "https://raw.githubusercontent.com/dvtate/dvtate.github.io/master/dls/perm/corki-roles.png",
            width: 94, height: 188
        }
}};
