

const logCmd = require("./logging.js");

module.exports = [

    { // vaporwave

        // if returns true then its correct command
        condition: function (msg) {
            return msg.content.match(/^\-vaporwave (.+)/);
        },

        // run when command is triggered
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

            // dict containg calsigns for each letter
            const callLetters = {
            	a: "alpha",    b: "bravo",	   c: "charlie",
            	d: "delta",	   e: "echo", 	   f: "foxtrot",
            	g: "golf", 	   h: "hotel",	   i: "india",
            	j: "juliett",  k: "kilo",      l: "lima",
            	m: "mike",     n: "november",  o: "oscar",
            	p: "papa", 	   q: "quebec",    r: "romeo",
            	s: "sierra",   t: "tango",     u: "uniform",
            	v: "victor",   w: "whiskey",   x: "x-ray",
            	y: "yankee",   z: "zulu",    '-':"tac",
                '|': "pipe", '!': "bang"
            };

            // split word into an array of letters
            const letters = msg.content.match(/^\-spell (.+)/)[1].toLowerCase().split('');

            // relpace each letter with its call-sign & recombine into string
            var resp = letters.map(c => { return callLetters[c]; }).join(" ").trim();

            msg.channel.send(resp);

        }
    },

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
