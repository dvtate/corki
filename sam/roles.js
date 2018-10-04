
const fs = require("fs");

const mods = require("./mods");
const sam = require("./sam");

module.exports.path;

function getRoles(serverID) {
    sam.populateServerDir(serverID); // be safe
    return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${serverID}/roles.json`));
}

module.exports.getRoles = getRoles;

function setRoles(serverID, roles) {
    sam.makeServerDir(serverID);
    fs.writeFileSync(`${process.env.HOME}/.corki/servers/${serverID}/roles.json`, JSON.stringify(roles));
}
module.exports.setRoles = setRoles;

function addRole(serverID, role) {

    // get roles from file
    let roles = getRoles(serverID);

    // dont want same role in twice
    if (roles.includes(role))
        return;

    // add it to list of roles
    roles.push(role);

    // write role to file
    setRoles(serverID, roles);
}

module.exports.addRole = addRole;


// delete roles config file
function resetRoles(serverID) {
    fs.unlinkSync(`${process.env.HOME}/.corki/servers/${serverID}/roles.json`);
}

module.exports.resetRoles = resetRoles;