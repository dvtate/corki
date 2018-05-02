
const fs = require("fs");
const teemo = require("./teemo.js");
const lol = require("./lol_stuff.js");

//const serverID = 418965788448391168;
const serverID = 435548322120335360; // test server

// gonna need a file to keep track of all accts masteries and
module.exports.configure = async function () {

    // when was the last time we posted the leaderboard
    if (!fs.existsSync(`${process.env.HOME}/.corki/lb/cd`))
        fs.writeFileSync(`${process.env.HOME}/.corki/lb/cd`, '0');

    // previous week's data so that we can show improvement
    if (!fs.existsSync(`${process.env.HOME}/.corki/lb/prev_data`))
        fs.writeFileSync(`${process.env.HOME}/.corki/lb/prev_data`, "[]");

}

function cd() {
    return Date.now() - fs.readFileSync(`${process.env.HOME}/.corki/lb/cd`) > 20000;
}
function resetcd(){
    fs.writeFileSync(`${process.env.HOME}/.corki/lb/cd`, Date.now());
}

function getPrevData() {
    return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/lb/prev_data`));
}




function getLeaderBoard(members, champ) {
    return new Promise( async (resolve, reject) => {

        let data = [];

        // get list of users with LoL accts
        const users = fs.readdirSync(`${process.env.HOME}/.corki/users`);

        // for each user
        for (let i = 0; i < users.length; i++) {

            // if they are also in this server, add them to the leaderboard
            if (members.exists("id", users[i])) {
                let pts;
                try {
                    pts = await lol.getUserMastery(users[i], champ);
                } catch (e) {
                    continue;
                }
                data = data.concat({
                    id: users[i],
                    pts: pts,
                    name: members.get(users[i]).user.username
                });
            }
        }

        // put list in order from greatest to least
        data.sort((a, b) => b.pts - a.pts);

        resolve(data);
    });
}

module.exports.getLeaderBoard = getLeaderBoard;

function formatLeaderBoard(arr, cname) {
    var ret = `Top ${cname} Players in this Server\n`;
    for (let i = 0; i < 10 && i < arr.length; i++)
        ret += `[${i+1}] **${arr[i].name}**: ${arr[i].pts} points\n`;
    return ret;
}

module.exports.formatLeaderBoard = formatLeaderBoard;


function postLeaderBoard() {
    if (!cd())
        return;


    let data = getLeaderBoard()


    resetcd();
}
