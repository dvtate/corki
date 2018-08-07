

const logCmd = require("../logging.js");

module.exports = [

    { // vaporwave

        // if returns true then its correct command
        condition: msg => msg.content.match(/^\-vaporwave (.+)/),

        // run when command is triggered
        act: async function (msg) {
            logCmd(msg, "likes -vaporwave");
            const arg = this.condition(msg)[1]
            msg.channel.send(require("./vaporwave.js").toVaporwave(arg));
        },
        tests: [ "-vaporwave test" ]
    },

    { // glitch
        condition: msg => msg.content.match(/^\-glitch (.+)/),

        act: async function (msg) {
            logCmd(msg, "-glitch'd text");
            const arg = this.condition(msg)[1];
            msg.channel.send(require("lunicode-creepify").encode(arg));
        },
        tests: [ "-glitch test" ]
    },

    { // tinycaps
        condition: msg => msg.content.match(/^\-tinycaps (.+)/),

        act: async function (msg) {
            logCmd(msg, "made text into -tinycaps");
            const arg = this.condition(msg)[1];
            msg.channel.send(require("lunicode-tiny").encode(arg));
        }
    },

    { // mirror
        condition: msg => msg.content.match(/^\-mirror (.+)/),

        act: async function (msg) {
            logCmd(msg, "reflected text with -mirror");
            const arg = this.condition(msg)[1];
            msg.channel.send(require("lunicode-mirror").encode(arg));
        }
    },

    { // flip
        condition: msg => msg.content.match(/^\-flip (.+)/),

        act: async function (msg) {
            logCmd(msg, "-flipped text");
            const arg = this.condition(msg)[1];
            msg.channel.send(require("lunicode-flip").encode(arg));
        }
    },

    { // spell
        condition: msg => msg.content.match(/^\-spell (.+)/),

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
            const letters = this.condition(msg)[1].toLowerCase().split('');

            // relpace each letter with its call-sign & recombine into string
            let resp = letters.map(c => { return callLetters[c]; }).join(" ").trim();

            msg.channel.send(resp);

        },
        tests: [ "-spell test" ]
    },

    { // help entry
        condition: msg => msg.content.match(/^\-(?:help )?(vaporwave|glitch|flip|mirror|tinycaps|spell)/),
        act: async function (msg) {
            logCmd(msg, `got help with a text command`);
            const cmd = this.condition(msg)[1];
            msg.channel.send("This command requires a text argument to modify. For example: ");
            msg.channel.send(`-${cmd} corki`);
        }
    }

];
