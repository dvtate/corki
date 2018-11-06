
const fs = require("fs");

const mods = require("./mods");
const sam = require("./sam");



/*
    .corki/severs/##id##/roles.json
    {
        roles: [" ", " ", " "],
        ignore_case: true
    }
*/


function getRoles(serverID) {
    try {
        return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${serverID}/roles.json`));
    } catch (e) {
        return { roles: [], ignore_case: false };
    }
}
module.exports.getRoles = getRoles;


function setRoles(serverID, roles) {
    sam.makeServerDir(serverID);
    fs.writeFileSync(`${process.env.HOME}/.corki/servers/${serverID}/roles.json`, JSON.stringify(roles));
}
module.exports.setRoles = setRoles;

function addRole(serverID, role) {

    // get roles from file
    let rdata = getRoles(serverID);

    // dont want same role in twice
    if (rdata.roles.includes(role))
        return;

    // add it to list of roles
    rdata.roles.push(role);

    // write role to file
    setRoles(serverID, rdata);
}

module.exports.addRole = addRole;


// delete roles config file
function resetRoles(serverID) {
    fs.unlinkSync(`${process.env.HOME}/.corki/servers/${serverID}/roles.json`);
}

module.exports.resetRoles = resetRoles;
