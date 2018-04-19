

const logCmd = require("./logging.js");

module.exports = [

    { // vaporwave
        condition: function (msg) {
            return msg.content.match(/^\-vaporwave (.+)/);
        },

        act: async function (msg) {
            logCmd(msg, "likes -vaporwave");
            const arg = msg.content.match(/^\-vaporwave (.+)/)[1]
            msg.channel.send(require("./vaporwave.js").toVaporwave(arg));
        }
    },

    { // glitch
        condition: function (msg) {
            return msg.content.match(/^\-glitch (.+)/);
        },

        act: async function (msg) {
            logCmd(msg, "-glitch'd text");
            const arg = msg.content.match(/^\-glitch (.+)/)[1];
            msg.channel.send(require("lunicode-creepify").encode(arg));
        }
    },

    { // tinycaps
        condition: function (msg) {
            return msg.content.match(/^\-tinycaps (.+)/);
        },

        act: async function (msg) {
            logCmd(msg, "made text into -tinycaps");
            const arg = msg.content.match(/^\-tinycaps (.+)/)[1];
            msg.channel.send(require("lunicode-tiny").encode(arg));
        }
    },

    { // mirror
        condition: function (msg) {
            return msg.content.match(/^\-mirror (.+)/);
        },

        act: async function (msg) {
            logCmd(msg, "reflected text with -mirror");
            const arg = msg.content.match(/^\-mirror (.+)/)[1];
            msg.channel.send(require("lunicode-mirror").encode(arg));
        }
    },

    { // flip
        condition: function (msg) {
            return msg.content.match(/^\-flip (.+)/);
        },

        act: async function (msg) {
            logCmd(msg, "-flipped text");
            const arg = msg.content.match(/^\-flip (.+)/)[1];
            msg.channel.send(require("lunicode-flip").encode(arg));
        }
    },


    { // help entry
        condition: function (msg) {
            return msg.content.match(/^\-vaporwave|^\-glitch|^\-flip|^\-mirror|^\-tinycaps/);
        },
        act: async function (msg) {
            logCmd(msg, "doesn't know how to use -vaporwave");
            msg.channel.send(`This command requires a text argument to act on\nexample: \`${msg.content} corki\``);
        }
    }

];
