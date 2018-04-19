

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

    { // spell
        condition: function (msg) {
            return msg.content.match(/^\-spell (.+)/);
        },

        act: async function (msg) {
            logCmd(msg, "-spell'd a word");

            const callLetters = {
            	a: "alpha",    b: "bravo",	   c: "charlie",
            	d: "delta",	   e: "echo", 	   f: "foxtrot",
            	g: "golf", 	   h: "hotel",	   i: "india",
            	j: "juliett",  k: "kilo",      l: "lima",
            	m: "mike",     n: "november",  o: "oscar",
            	p: "papa", 	   q: "quebec",    r: "romeo",
            	s: "sierra",   t: "tango",     u: "uniform",
            	v: "victor",   w: "whiskey",   x: "x-ray",
            	y: "yankee",   z: "zulu"
            };

            const letters = msg.content.match(/^\-spell (.+)/)[1].toLowerCase().split('');

            var resp = "";

            for (var i = 0; i < letters.length; i++)
                resp += callLetters[letters[i]] + " ";

            resp = resp.trim();

            msg.channel.send(resp);

        }
    }

    { // help entry
        condition: function (msg) {
            return msg.content.match(/^\-vaporwave|^\-glitch|^\-flip|^\-mirror|^\-tinycaps|^\-spell/);
        },
        act: async function (msg) {
            logCmd(msg, `doesn't know how to use ${msg.content}`);
            msg.channel.send(`This command requires a text argument to act on\nexample: \`${msg.content} corki\``);
        }
    }

];
