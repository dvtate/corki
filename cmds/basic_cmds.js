
const logCmd = require("../logging.js");
const request = require("request");

module.exports = [

    { // 8ball
        condition: msg => msg.content.match(/^-8ball(?:$|\s)/),

        act: async function (msg) {
            logCmd(msg, "shook -8ball");

            // send random response from [yes,no, maybe]
            msg.channel.send(["yes", "no", "maybe"] [Math.floor(Math.random() * 3)]);

            /*
            // all the responses on standard 8ball, i think this is too much tho
            const responses = [ "It is certain", "It is decidedly so", "Without a doubt",
              "Yes definitely", "You may rely on it", "As I see it, yes",
              "Most likely", "Outlook good", "Yes", "Signs point to yes",
              "Reply hazy try again", "Ask again later",
              "Better not tell you now", "Cannot predict now",
              "Concentrate and ask again", "Don't count on it",
              "My reply is no", "My sources say no", "Outlook not so good",
              "Very doubtful"];

            msg.channel.send(responses[Math.floor(Math.random() * responses.length)]);
            */
        }
    },

    { // echo
        condition: msg => msg.content.match(/^\-echo (.+)/),

        act: async function (msg) {
            logCmd(msg, "caused an -echo");

            const content = msg.content.match(/^-echo (.+)/)[1];
            msg.channel.send(content);
        }
    },

    { // echo help
        condition: msg => msg.content.match(/^-echo(?:$|\s)/),
        act: async function (msg) {
            logCmd(msg, "-echo'd a message"),
            msg.channel.send("`-echo` expected a message");
        }
    },

    { // coin flip
        condition: msg => msg.content.match(/^-coinflip(?:$|\s)/),

        act: async function (msg) {
            logCmd(msg, "flipped a coin");
            msg.channel.send(Math.random() < 0.5 ? "tails" : "heads");
        }
    },

    { // random
        condition: msg => msg.content.match(/^-random (.+)/),

        act: async function (msg) {
            logCmd(msg, "used RNG");

            const args = msg.content.match(/^-random (.+)/)[1];
        	let lims = args.split(/ |,|\n|, /);
        	//logCmd(msg, `random :: ${lims}`);

        	let rand;
        	if (lims.length == 1) {
        		const min = 0;
        		const max = Math.floor(Number(lims[0]))
        		rand = (Math.floor(Math.random() * (max - min)) + min);
        	} else if (lims.length >= 2) {
        		const min = Math.ceil(Number(lims[1]));
        		const max = Math.floor(Number(lims[0]));
        		rand = (Math.floor(Math.random() * (max - min)) + min);
        	} else {
                msg.channel.send(randomHelpInfo);
            }

    		msg.channel.send(`random number = ${rand}`);


        }

    },

    { // random help
        condition: msg => msg.content.match(/^-random(?:$|\s)|^-help random(?:$|\s)/),
        act: async msg => msg.channel.send(randomHelpInfo)

    },

    { // xkcd with options
        condition: msg => msg.content.match(/^-xkcd (.+)/),

        act: async function (msg) {

            logCmd(msg, "read -xkcd");

            const num = msg.content.match(/^-xkcd (.+)/)[1];
            const url = `https://xkcd.com/${num == "latest" ? "" : num}`;


            request(url, (error, response, body) => {

                if (error) {
                    console.log(`-xkcd - error: ${error}`);
                    console.log(`    statusCode: ${response && response.statusCode}`);
                    msg.channel.send("xkcd appears to be down right now :/");
                    return;
                }

                if (!body.match(/<div id="comic">\n<img src="(.+?)"\s/)) {
                    console.log("invalid -xkcd number");
                    msg.channel.send("invalid xkcd comic number :/");
                    return;
                }

                const imgurl = `https:${body.match(/<div id="comic">\n<img src="(.+?)"\s/)[1]}`;
                const title = body.match(/<div id="ctitle">(.+?)<\/div>/)[1];
                msg.channel.send(`${title} ${imgurl}`);

            });

        }

    },

    { // xkcd
        condition: msg => msg.content.match(/^-xkcd(?:$|\s)/),

        act: async function (msg) {
            logCmd(msg, "read -xkcd");
            request("https://c.xkcd.com/random/comic/", (error, response, body) => {

                if (error) {
                    console.log(`-xkcd - error: ${error}`);
                    console.log(`    statusCode: ${response && response.statusCode}`);
                    bot.sendMessage(msg.chat.id, "xkcd appears to be down right now :/", { reply_to_message_id : msg.message_id });
                    return;
                }

                const imgurl = `https:${body.match(/<div id="comic">\n<img src="(.+?)"\s/)[1]}`;
                const title = body.match(/<div id="ctitle">(.+?)<\/div>/)[1];
                msg.channel.send(`${title} ${imgurl}`);

            });
        }

    }


];



const randomHelpInfo = { embed: {
    title: "-Random help",
    description: "`-random` is an RNG command which gives you a random number within given parameters",
    fields: [
        {
            name: "Argument Formats",
            value: `Different argument formats give different outputs
\`-random <a> <b>\`: a random integer between a and b inclusive --- [a, b]
\`-random <a>\`: a random number n where 0 <= n < a --- [0, a)`
        }, {
            name: "Examples",
            value: `
\`-random 10\`: to rate someones performance.
\`-random 1 100\`: I'm thinking of a number.
\`-random 1,100\`: same as above but commas.`
        }
    ]
}};
