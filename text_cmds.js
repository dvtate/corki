

const logCmd = require("./logging.js");

module.exports = [

    { // vaporwave
        condition: function (msg) {
            msg.content.match(/^\-vaporwave (.+)/);
        },

        act: async function (msg) {
            logCmd(msg, "likes -vaporwave");
            msg.channel.send(require("./vaporwave.js").toVaporwave(msg.content));
        }
    },

    { // glitch
        condition: function (msg) {
            msg.content.match(/^\-glitch (.+)/);
        },

        act: async function (msg) {
            logCmd(msg, "-glitch'd text");
            msg.channel.send(require("lunicode-creepify").encode(msg.content));
        }
    },

    { // tinycaps
        condition: function (msg) {
            msg.content.match(/^\-tinycaps (.+)/);
        },

        act: async function (msg) {
            logCmd(msg, "made text into -tinycaps");
            msg.channel.send(require("lunicode-tiny").encode(msg.content));
        }
    },

    { // mirror
        condition: function (msg) {
            msg.content.match(/^\-mirror (.+)/);
        },

        act: async function (msg) {
            logCmd(msg, "reflected text with -mirror");
            msg.channel.send(require("lunicode-mirror").encode(msg.content));
        }
    },

    { // flip
        condition: function (msg) {
            msg.content.match(/^\-flip (.+)/);
        },

        act: async function (msg) {
            logCmd(msg, "-flipped text");
            msg.channel.send(require("lunicode-flip").encode(msg.content));
        }
    }


];
