

const logCmd = require("./logging.js");

module.exports = [

    { // currency exchange
        condition: function (msg) {
            return msg.content.match(/^\-exchange ([0-9\.]+)\s?([a-zA-Z]{3})(?:\sto\s|\s)?([a-zA-Z]{3})(?:$|\s)/);
        },
        act: async function (msg) {

            const match = msg.content.match(/^\-exchange ([0-9\.]+)\s?([a-zA-Z]{3})(?:\sto\s|\s)?([a-zA-Z]{3})(?:$|\s)/);
            // currency conversion api
        	var exchange = require("open-exchange-rates"),
        		fx = require("money");
        	exchange.set({ app_id : "2e7a1b340cc64e4a838c5f28309805da" });

        	// get current exchange-rates
        	exchange.latest(function() {
        		// Apply exchange rates and base rate to money/fx library object:
        		fx.rates = exchange.rates;
        		fx.base	= exchange.base;

        		try {
        			// calculate conversion
        			const out = fx.convert(parseFloat(match[1]), {
        				from : match[2].toUpperCase(),
        				to : match[3].toUpperCase()
        			});


        			// write to logfile
        			logCmd(msg, `converted ${match[2]} to ${match[3]}`);

        			// send results to user
                    msg.channel.send(`${out} ${match[3]}`)

        		// exchange error
        		} catch (e) {
        			if (e == "fx error")
                        msg.channel.send("invalid currency. See list: \
        https://www.easymarkets.com/int/learn-centre/discover-trading/currency-acronyms-and-abbreviations/");

        			else
                        msg.channel.send("something's not right... :/");

        			logCmd(msg, `-exchange caught error: ${e}`);
        		}
        	});
        }
    },

    { // timezone convert
        condition: function (msg) {
            return msg.content.match(/^\-timezone (.+)/);
        },
        act: async function (msg) {


            logCmd(msg, "/timezone'd");

            const time = require("time");

            const tz = msg.content.match(/^\-timezone (.+)/)[1];

            let timeConv = new time.Date();

        	try {

        		// get local time
            	timeConv.setTimezone(tz);

        		// send msg
                msg.channel.send(`Time in ${tz}: ${timeConv.toString()}`);

        	} catch (e) { // catch errors from invalid tz
                console.log(e);
        		logCmd(msg, "gave invalid /timezone");
                msg.channel.send("Invalid timezone\nSee: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List");

            };
        }
    }




];
