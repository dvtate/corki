
const logCmd = require("./logging.js");

module.exports = [

    { // ping

        // returns true if command fits
        condition: function (msg) {
            return msg.content.match(/^\-ping/);
        },

        // run to perform command
        act: async function (msg) {
            logCmd(msg, "-ping'd");
            msg.channel.send("pong");
        }

    },

    { // log
        condition: function (msg) {
            return msg.content.match(/^\-logmsg/);
        },

        act: async function (msg) {
            msg.channel.send(`logged msg to stdout`);
            console.log(msg);
        }

    }
];
