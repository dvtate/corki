

const logCmd = require("./logging.js");

module.exports = [
    { // help
        condition: function (msg) {
            return msg.content.match(/^-help/);
        },
        act: async function (msg) {

            logCmd(msg, "asked for -help");

            msg.channel.send({ embed: {
                color: 0x3498db,
                title: "Corki Bot",
                description: " Corki is a bot designed by and for Corki mains to provide a variety of functionality.\n"
                    + "If you don't know how to format arguments to a command try running it without them.",

                fields: [
                    {
                        name: "General Commands",
                        value: `
* \`-help\`: access this message.
* \`-8ball [question]\`: answers yes, no, or maybe.
* \`-echo <quote>\`: repeats <quote>.
* \`-coinflip\`: sends heads or tails.
* \`-random <args>\`: sends random number.
* \`-xkcd [comic#|latest]\`: sends XKCD comic.
                        `
                    }, {
                        name: "International Commands",
                        value: `
* \`-exchange <amount> <from> <to>\`: convert between currencies.
* \`-timezone <unix-tz>\`: gives local time in given unix timezone.`
                    }, {
                        name: "Corki Commands",
                        value: "* \`-spell <word>\`: spells word using military phonetic alphabet."
                    }
                ],

                timestamp: new Date(),



            }});


        }
    },


];
