const logCmd = require("../logging");

const roles = require("./roles");
const mods = require("./mods");

module.exports = [
    { // mod add roles

        condition: msg => msg.content.match(/^add-(?:ssignable-roles?|sar) (.+)/),

        act: async function (msg) {

            if (!msg.guild) {
                msg.channel.send("This command cannot be used in DM's")
                return;
            }
            if (!mods.isMod(msg.guild.id, msg.author.id) && (
                    !msg.member
                    || !msg.member.permissions.has(global.Discord.Permissions.FLAGS.MANAGE_ROLES))
            ) {
                msg.channel.send("You must be given permission to run server \
management commands in order to perform this action. Ask an administrator to grant \
you these powers via https://corki.js.org/admin");
                return;
            }


            logCmd(msg, "added a self-assignable role");

            this.condition(msg)[1] // find roles argument
                    .split(",")                         // take each role (separated by commas)
                        .map(r => r.trim())             // trim whitespace
                            .forEach(r => roles.addRole(msg.guild.id, r)); // add the roles
            msg.react("👍");
        }
    },

    { // self assign role
        condition: msg => msg.content.match(/^iam (.+)/),

        act: async function (msg) {

            logCmd(msg, "added a role via -iam");

            // designated self assignable roles for server
            const serverRoles = roles.getRoles(msg.guild.id);

            let desiredRoles =
                this.condition(msg)[1]          // find roles argument
                    .split(',')                 // take each role (separated by commas)
                        .map(r => r.trim());    // trim whitespace

            // verify the roles are valid
            for (let i = 0; i < desiredRoles.length; i++)
                if (!serverRoles.includes(desiredRoles[i])) {
                    msg.channel.send(`Invalid role "${roles[i]}"`);
                    return;
                }

            // map each role to its coresponding id
            desiredRoles.map(r => msg.guild.roles.find("name", r))
                // give user each of the roles they asked for
                .forEach(r => msg.member.addRole(r).catch(e => {
                    if (e.name == "TypeError")
                        msg.channel.send("It appears the server administrator hasn't \
added this role to the server yet. Maybe you should remind them about it");
                }));

            msg.react("👍");

        },
        tests: [ "-iam ff", "-iam gg, test" ]

    },

    { // list roles
        condition: msg => msg.content.match(/^(?:roles|iam)(?:$|\s)/),

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
        },
        tests: [ "-roles" ]
    },

    { // remove role
        condition: msg => msg.content.match(/^iamnot (.+)/),

        act: async function (msg) {
            let rm_roles = this.condition(msg)[1]  // find roles argument
                    .split(",")                 // take each role (separated by commas)
                        .map(r => r.trim());    // reomve excess whitespace


            // designated self assignable roles for server
            const serverRoles = roles.getRoles(msg.guild.id);

            rm_roles.forEach(role => {
                const r = msg.guild.roles.find("name", role);
                if (!r || !serverRoles.includes(role))
                    msg.channel.send(`invalid role "${role}" ignored`);
                else
                    msg.member.removeRole(r).catch(console.error);
            });

            msg.react("👍");

        },
        tests: [ "-iamnot ff", "-iamnot gg, ff" ]
    },

    { // make roles unassignable again
        condition: msg => msg.content.match(/^reset-(?:ssignable-roles?|sar)/),
        act: async (msg) => {

            if (!msg.guild) {
                msg.channel.send("This command cannot be used in DM's")
                return;
            }
            if (!mods.isMod(msg.guild.id, msg.author.id) && (
                    !msg.member
                    || !msg.member.permissions.has(global.Discord.Permissions.FLAGS.MANAGE_ROLES))
            ) {
                msg.channel.send("You must be given permission to run server \
management commands in order to perform this action. Ask an administrator to grant \
you these powers via https://corki.js.org/admin");
                return;
            }

            roles.resetRoles(msg.guild.id);

            msg.react("👍");

        },
        tests: [ "-reset-sar" ]
    }


];
