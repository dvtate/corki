

const logCmd = require("./logging.js");

module.exports = [

    { // vaporwave
        condition: function (msg) {
            msg.content.match(/^\-vaporwave (.+)/);
        },

        act: async function (msg) {
            msg.channel.send(require("./vaporwave.js").toVaporwave(msg.content));
        }
    },

    { // glitch
        condition: function (msg) {
            msg.content.match(/^\-glitch (.+)/);
        },

        act: async function (msg) {
            msg.channel.send(require("lunicode-creepify").encode(msg.content));
        }
    },

    { // tinycaps
        condition: function (msg) {
            msg.content.match(/^\-tinycaps (.+)/);
        },

        act: async function (msg) {
            msg.channel.send(require("lunicode-tiny").encode(msg.content));
        }
    },

    { // mirror
        condition: function (msg) {
            msg.content.match(/^\-mirror (.+)/);
        },

        act: async function (msg) {
            msg.channel.send(require("lunicode-mirror").encode(msg.content));
        }
    },

    { // flip
        condition: function (msg) {
            msg.content.match(/^\-flip (.+)/);
        },

        act: async function (msg) {
            msg.channel.send(require("lunicode-flip").encode(msg.content));
        }
    }


];
