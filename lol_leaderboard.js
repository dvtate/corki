
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
        ret += `[${i + 1}] **${arr[i].name}**: ${arr[i].pts} points\n`;
    return ret;
}

module.exports.formatLeaderBoard = formatLeaderBoard;

// returns a list with each member set to the difference in pts since last week
function lb_delta(lb) {
    // last weeks leaderboard
    const prev = getPrevData();

    // ret
    let delta = [];

    // for each member on this weeks leaderboard
    lb.forEach(user => {
        // find them on last weeks
        let match = prev.find(e => e.id == user.id);
        // if they weren't here last week they have added all of their
        // points in the past week (new register)
        if (!match)
            match = user;
        else
            match.pts = user.pts - match.pts;

        // add to ret
        delta = delta.concat(match);
    });


    // put list in order from greatest to least (most improved)
    delta.sort((a, b) => b.pts - a.pts);

    //
    return delta;

}


// weekly post of leaderboard to #mastery in corkimains server
async function postLeaderBoard() {
    // make sure it's been a week
    if (!cd())
        return;

    console.log("sent weekly leaderboard to #mastery");

    // members of server
    const members = global.client.channels.get(chanID).guild.members;

    // mastery leaderboard
    const data = await getLeaderBoard(members, 42); // 42 = corki-id

    // changes since last week
    const delta = lb_delta(data);

    // post leaderboard
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

        // corki champ icon
        thumbnail: {
           url: "https://raw.githubusercontent.com/dvtate/dvtate.github.io/master/imgs/corki.png"
        }
    }});


    // so that we can calculate deltas for next week too
    writePrevData(data);
    // don't post again until next weeek
    resetcd();
}


// calls loadFeed every 10 mins
function lbrefresh() {
    postLeaderBoard();
    setTimeout(lbrefresh, 120000); // every 2 mins
}
setTimeout(lbrefresh, 10000); // give 10 seconds for bot to start before checking
