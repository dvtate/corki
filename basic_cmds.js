
const logCmd = require("./logging.js");
const request = require("request");

module.exports = [

    { // 8ball
        condition: function (msg) {
            return msg.content.match(/^\-8ball/);
        },

        act: async function (msg) {
            logCmd(msg, "shook -8ball");
            // sry unreadable
            msg.channel.send(["yes", "no", "maybe"] [Math.floor(Math.random() * 3)]);
        }
    },

    { // echo
        condition: function (msg) {
            return msg.content.match(/^\-echo (.+)/);
        },

        act: async function (msg) {
            logCmd(msg, "caused an -echo");

            const content = msg.content.match(/^\-echo (.+)/)[1];
            msg.channel.send(content);
        }
    },

    { // coin flip
        condition: function (msg) {
            return msg.content.match(/^\-coinflip/);
        },

        act: async function (msg) {
            logCmd(msg, "flipped a coin");
            msg.channel.send(Math.random() < 0.5 ? "tails" : "heads");
        }
    },

    { // random
        condition: function (msg) {
            return msg.content.match(/^\-random (.+)/);
        },

        act: async function (msg) {
            logCmd(msg, "used RNG");

            const args = msg.content.match(/^\-random (.+)/)[1];
        	var lims = args.split(/ |,|\n/);
        	//logCmd(msg, `random :: ${lims}`);

        	var rand;
        	if (lims.length === 1) {
        		const min = 0;
        		const max = Math.floor(Number(lims[0]))
        		rand = (Math.floor(Math.random() * (max - min)) + min);
        	} else if (lims.length === 2) {
        		const min = Math.ceil(Number(lims[1]));
        		const max = Math.floor(Number(lims[0]));
        		rand = (Math.floor(Math.random() * (max - min)) + min);
        	} else {
                msg.channel.send(`
-random <num1>' -> random number (0 <= n < num1)\n
-random <num1> <num2>' -> random number (num1 <= n <= num2)`);
                return;
        	}

    		msg.channel.send(`random number = ${rand}`);


        }

    },

    { // xkcd with options
        condition: function (msg) {
            return msg.content.match(/^\-xkcd (.+)/);
        },

        act: async function (msg) {

            logCmd(msg, "read -xkcd");

            const num = msg.content.match(/^\-xkcd (.+)/)[1];
            const url = `https://xkcd.com/${num === "latest" ? "" : num}`;


            request(url, (error, response, body) => {

                if (error) {
                    console.log(`-xkcd - error: ${error}`);
                    console.log(`    statusCode: ${response && response.statusCode}`);
                    bot.sendMessage(msg.chat.id, "xkcd appears to be down right now :/", { reply_to_message_id : msg.message_id });
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
        condition: function (msg) {
            return msg.content.match(/^\-xkcd/);
        },

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
