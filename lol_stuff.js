
/*


~/.corki/                       -- bot configuration and stuff
    users/                      -- users
    userid/                     -- user directory
        lol.json                -- contains league acct info
        *profile_verif.tmp*     -- tmp file for verifying acct ownership (won't be added in first iteration)


*/

const fs = require("fs");

const teemo = require("./teemo.js");
const riot = teemo.riot;
const champgg = teemo.champgg;


// configures a user directory
module.exports.setupDir = function (id) {
    if (fs.existsSync(`${process.env.HOME}/.corki/users/${id}`))
        return true;

    fs.mkdirSync(`${process.env.HOME}/.corki/users/${id}`);
    fs.writeFileSync(`${process.env.HOME}/.corki/users/${id}/lol.json`, `
        {
            main: 0,
            accounts: []
        }
    `);

    return false;
}

/*

{
    accounts: [
        {
            region: "",

        }
    ]
}

*/



function getUserData (id) {

    if (!fs.existsSync(`${process.env.HOME}/.corki/users/${id}/lol.json`))
        return null;

    return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/users/${id}/lol.json`));

}
module.exports.getUserData = getUserData;

async function getAcctData (id, req, cb) {
    arguments

    const data = getUserData(id);
    if (!data)
        return null;

    var accts = data.accounts;

    for (var i = 0; i < data.length; i++) {
        data[i] = await riot.get()

    }

}

module.exports.getAcctData = getAcctData;
