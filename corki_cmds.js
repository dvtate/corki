
const logCmd = require("./logging.js");

module.exports = [

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

];
