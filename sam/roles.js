
const fs = require("fs");

const mods = require("./mods");
const sam = require("./sam");


function getRoles(serverID) {
    sam.populateServerDir(serverID); // be safe
    return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${serverID}/roles.json`));
}

module.exports.getRoles = getRoles;


function addRole(role, serverID) {
    sam.populateServerDir(serverID); // be safe

    // get roles from file
    let roles = getRoles(serverID);

    // dont want same role in twice
    if (roles.includes(role))
        return;

    // add it to list of roles
    roles = roles.concat(role);

    // write role to file
    fs.writeFileSync(`${process.env.HOME}/.corki/servers/${serverID}/roles.json`, JSON.stringify(roles));
}

module.exports.addRole = addRole;


// delete roles config file
function resetRoles(serverID) {
    fs.unlinkSync(`${process.env.HOME}/.corki/servers/${serverID}/roles.json`);
}

module.exports.resetRoles = resetRoles;
