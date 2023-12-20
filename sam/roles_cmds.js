const logCmd = require("../logging");

const roles = require("./roles");
const mods = require("./mods");

module.exports = [
    { // mod add roles

        condition: msg => msg.content.match(/^(?:add-(?:ssignable-roles?|sar)|sar add) (.+)/),

        act: async function (msg) {

            if (!msg.guild) {
                msg.channel.send("This command cannot be used in DM's")
                return;
            }
            if (!await mods.auth(msg))
                return;


            logCmd(msg, "");

            let rs = this.condition(msg)[1] // find roles argument
                        .split(",")                         // take each role (separated by commas)
                            .map(r => r.trim())             // trim whitespace

            rs.forEach(r => {
                if (!msg.guild.roles.cache.find(gr => gr.name = r))
                    msg.channel.send(`Don't forget to add the role ${r} in Discord settings. (It currently doesn't exist)`);
            });
            rs.forEach(r => roles.addRole(msg.guild.id, r)); // add the roles

            msg.react("👍");
        }
    },

    { // self assign role
        condition: msg => msg.content.match(/^(?:iam|sar) (.+)/),

        act: async function (msg) {

            logCmd(msg, "-iam ()");

            // designated self assignable roles for server
            const { roles: serverRoles, ignore_case } = roles.getRoles(msg.guild.id);

            let desiredRoles =
                this.condition(msg)[1]          // find roles argument
                    .split(',')                 // take each role (separated by commas)
                        .map(r => r.trim());    // trim whitespace


            // attempt to give user each of the roles they asked for
            desiredRoles.forEach(r => {
                    // role name from sar config file
                    let sRole = serverRoles.find(sr => ignore_case ? sr.toLowerCase() == r.toLowerCase() : sr == r);
                    // corresponding disocrd guild role object
                    let gRole = msg.guild.roles.cache.find(gr => ignore_case ? gr.name.toLowerCase() == r.toLowerCase() : gr.name == r);

                    if (!sRole)
                        return msg.channel.send(`invalid role \`${r}\` ignored.${ignore_case ? "" : " (note: this server's roles are case-sensitive)"}`);
                    if (!gRole)
                        return msg.channel.send(`it appears the server administrator hasn't added (or maybe has removed) the \`${r}\` role to the server`);

                    msg.member.roles.add(gRole).catch(e => {
                        if (e.message == "Missing Permissions")
                            msg.channel.send(`It appears that Corki doesn't have the permissions\
required to assign the \`${r}\` role. Does Corki have a role higher than the one you are trying to assign?`);
                        else if (e.name && e.message)
                            msg.channel.send(`That failed: ${e.name}: ${e.message}`);
                        else {
                            msg.channel.send(`Assigning role \`${r}\` failed... not sure why`);
                            console.log("Couldn't assign role:", e);
                        }
                    })
                });

            msg.react("👍");

        },
        tests: [ "-iam ff", "-iam gg, test" ]

    },

    { // list roles
        condition: msg => msg.content.match(/^(?:roles|iam|lsar|sar)(?:$|\s)/),

        act: async function (msg) {
            logCmd(msg, "-roles");
            let sar = roles.getRoles(msg.guild.id);
            if (roles.length == 0)
                msg.channel.send(`This server doesn't have any self-assignable roles.
A moderator can configure them using \`-add-sar\`.
After that point they can be added via \`-iam\``)
            else
                msg.channel.send(`Self-assignable roles on this server: ${sar.roles.join(", ")}
To self-assign a role you can use the command \`-iam <role>\``);
        },
        tests: [ "-roles" ]
    },

    { // remove role
        condition: msg => msg.content.match(/^(?:iamnot|sar remove) (.+)/),

        act: async function (msg) {
            let rm_roles = this.condition(msg)[1]  // find roles argument
                    .split(",")                 // take each role (separated by commas)
                        .map(r => r.trim());    // reomve excess whitespace


            // designated self assignable roles for server
            const { roles: serverRoles, ignore_case } = roles.getRoles(msg.guild.id);

            rm_roles.forEach(role => {
                const sRole = serverRoles.find(r => ignore_case ? r.toLowerCase() == role.toLowerCase() : r == role);
                const gRole = msg.guild.roles.cache.find(gr => ignore_case ? gr.name.toLowerCase() == role.toLowerCase() : gr.name == role);
                if (!sRole || !gRole)
                    return msg.channel.send(`Invalid role \`${role}\` ignored`)

                msg.member.roles.remove(gRole).catch(e => {
                    if (e.message == "Missing Permissions")
                        msg.channel.send(`It appears that Corki doesn't have the permissions\
                    required to manage the \`${role}\` role. Does Corki have a role higher than the one you are trying to remove?`);
                    else if (e.name && e.message)
                        msg.channel.send(`Removing role \`${role}\` failed: ${e.name}: ${e.message}`);
                    else {
                        msg.channel.send(`Removing role \`${role}\` failed... not sure why`);
                        console.log("Couldn't rm role:", e);
                    }
                });
            });

            msg.react("👍");

        },
        tests: [ "-iamnot ff", "-iamnot gg, ff" ]
    },

    { // make roles unassignable again
        condition: msg => msg.content.match(/^(?:reset-(?:ssignable-roles?|sar)|sar reset)/),
        act: async (msg) => {
            if (!msg.guild) {
                msg.channel.send("This command cannot be used in DM's")
                return;
            }
            // unauthorized
            if (!await mods.isMod(msg.guild.id, msg.author.id) && (
                    !msg.member
                    || !msg.member.permissions.has(global.Discord.Permissions.FLAGS.MANAGE_ROLES))
            ) {
                msg.channel.send("You must be given permission to run server \
management commands in order to perform this action. Ask an administrator to grant \
you these powers via https://corki.js.org/admin or give you the MANAGE_ROLES privelege.");
                return;
            }

            roles.resetRoles(msg.guild.id);

            msg.react("👍");

        },
        tests: [ "-reset-sar" ]
    }
];
