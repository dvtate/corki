
const logCmd = require("./logging.js");

module.exports = [

    { // ping

        // returns true if command fits
        condition: function (msg) {
            return msg.content.match(/^\-ping/);
        },

        // run to perform command
        act: function (msg) {
            logCmd(msg, "-ping'd");
            msg.channel.send("pong");
        }

    },

    { // log
        condition: function (msg) {
            return msg.content.match(/^\-logmsg/);
        },

        act: function (msg) {
            msg.channel.send(`msg: ${msg}`);
            console.log(msg);
        }

    },

    { // test cmd
        condition: function (msg) {
            return msg.content.match(/^\-testcmd/);
        },

        act: function (msg) {
            msg.reply(msg.channel.id);
            console.log(global.client.channels);
            global.client.channels.find("id", "418968921186631692").send("o lol");
        }

    }
];
