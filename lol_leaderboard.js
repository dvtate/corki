
const fs = require("fs");
const teemo = require("./teemo.js");
const lol = require("./lol_stuff.js");

const chanID = "418965788448391168";
//const chanID = "435548322120335360"; // test server

// gonna need a file to keep track of all accts masteries and
module.exports.configure = async function () {

    // when was the last time we posted the leaderboard
    if (!fs.existsSync(`${process.env.HOME}/.corki/lb/cd`))
        fs.writeFileSync(`${process.env.HOME}/.corki/lb/cd`, '0');

    // previous week's data so that we can show improvement
    if (!fs.existsSync(`${process.env.HOME}/.corki/lb/prev_data`))
        fs.writeFileSync(`${process.env.HOME}/.corki/lb/prev_data`, "[]");

}

// cooldown of approximately a week/5 days
function cd() {
    return Date.now() - fs.readFileSync(`${process.env.HOME}/.corki/lb/cd`) > 500000000;
}
function resetcd(){
    fs.writeFileSync(`${process.env.HOME}/.corki/lb/cd`, Date.now());
}

function getPrevData() {
    return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/lb/prev_data`));
}
function writePrevData(data){
    fs.writeFileSync(`${process.env.HOME}/.corki/lb/prev_data`, JSON.stringify(data));
}



async function getLeaderBoard(members, champ) {
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

function formatLeaderBoard(arr) {
    let ret = "";
    for (let i = 0; i < 10 && i < arr.length; i++)
        ret += `[${i+1}] **${arr[i].name}**: ${arr[i].pts} points\n`;
    return ret;
}

module.exports.formatLeaderBoard = formatLeaderBoard;

function lb_delta(lb) {
    const prev = getPrevData();
    let delta = [];

    lb.forEach(user => {
        let match = prev.find(e => e.id == user.id);
        if (!match)
            match = user;
        else
            match.pts = user.pts - match.pts;

        delta = delta.concat(match);
    });


    // put list in order from greatest to least
    delta.sort((a, b) => b.pts - a.pts);


    return delta;

}
async function postLeaderBoard() {
    if (!cd())
        return;

    const members = global.client.channels.get(chanID).guild.members;

    const data = await getLeaderBoard(members, 42); // corki
    const delta = lb_delta(data);

    let msg = formatLeaderBoard(data) + '\n';
    msg += formatLeaderBoard(delta);

    global.client.channels.get(chanID).send({embed: {
        title: "Corki Mastery Leaderboard",
        fields: [
            {
                name: "Most points total:",
                value: formatLeaderBoard(data)
            }, {
                name: "Most points gained:",
                value: formatLeaderBoard(delta)
            }
        ],
        thumbnail: {
           url: "https://raw.githubusercontent.com/dvtate/dvtate.github.io/master/imgs/corki.png"
        }
    }});


    writePrevData(data);
    resetcd();
}


// calls loadFeed every 10 mins
function refresh() {
    postLeaderBoard();
    //console.log("checked subreddit");
    setTimeout(refresh, 10000);
}
setTimeout(refresh, 10000); // give 10 seconds for bot to start before checking
