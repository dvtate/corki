const fs = require("fs");


function mkUserDir(userid) {
    if (!fs.existsSync(`${process.env.HOME}/.corki/users/${userid}`))
        fs.mkdirSync(`${process.env.HOME}/.corki/users/${userid}`);
}
module.exports.mkUserDir = mkUserDir;

/* directory population:
* lol.json : lol accounts config file
* pend.json : temporary file for lol acct linking
* lol-mastery.json : cached mastery data
* ...
*/
