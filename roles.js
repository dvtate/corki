


const logCmd = require("./logging.js");
const fs = require("fs");

function makeServer(serverID) {
    if (fs.existsSync(`${process.env.HOME}/.corki/servers/${serverID}`))
        return true;

    fs.mkdirSync(`${process.env.HOME}/.corki/servers/${serverID}`);
    fs.writeFileSync(`${process.env.HOME}/.corki/servers/${serverID}/roles.json`, "[]");

    return false;
}

function getRoles(serverID) {
    makeServer(serverID); // just to be safe
    return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${serverID}/roles.json`));
}

function addRole(role, serverID) {
    makeServer(serverID); // just to be safe

    // get roles from file
    var roles = getRoles(serverID);

    // dont want same role in twice
    if (roles.includes(role))
        return;

    // add it to list of roles
    roles = roles.concat(role);

    // write role to file
    fs.writeFileSync(`${process.env.HOME}/.corki/servers/${serverID}/roles.json`, JSON.stringify(roles));
}


module.exports = [
    { // mod add roles

        condition: function (msg) {
            return msg.content.match(/^-add-assignable-role (.+)/);
        },

        act: async function (msg) {

            logCmd(msg, "added a self-assignable role");

            msg.content
                .match(/^-add-assignable-role (.+)/)[1] // find roles argument
                    .split(",")                         // take each role (separated by commas)
                        .map(r => r.trim())             // trim whitespace
                            .forEach(r => addRole(r, msg.guild.id)); // add the roles

            msg.channel.send("Done!");
        }
    },

    { // self assign role
        condition: function (msg) {
            return msg.content.match(/^-iam (.+)/);
        },

        act: async function (msg) {

            logCmd(msg, "added a role via -iam");

            const serverRoles = getRoles(msg.guild.id);

            var roles = msg.content
                .match(/^-iam (.+)/)[1]         // find roles argument
                    .split(",")                 // take each role (separated by commas)
                        .map(r => r.trim());    // trim whitespace

            // verify the roles are valid
            for (var i = 0; i < roles.length; i++)
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
        condition: function (msg) {
            return msg.content.match(/^-(?:roles|iam)(?:$|\s)/);
        },

        act: async function (msg) {
            msg.channel.send(`Self-assignable roles on this server: ${getRoles(msg.guild.id).join(", ")}
To self-assign a role you can use the command \`-iam <role>\`
            `);
        }
    },

    { // remove role
        condition: function (msg) {
            return msg.content.match(/^-iamnot (.+)/);
        },

        act: async function (msg) {
            msg.content.match(/^-iamnot (.+)/)[1]                           // find roles argument
                    .split(",")                                             // take each role (separated by commas)
                        .map(r => msg.guild.roles.find("name", r.trim()))   // map roles to coresponding id's
                            .forEach(r => {                                 // attempt to remove each role
                                if (!r)
                                    msg.channel.send("invalid role ignored");
                                else
                                    msg.member.removeRole(r).catch(console.error);});

            msg.channel.send("done!");

        }
    },

];
