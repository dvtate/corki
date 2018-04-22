

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
        			if (e == "fx error") {
                        msg.channel.send("invalid currency");
                        msg.channel.send(exchangeHelpInfo);
        			} else
                        msg.channel.send("something's not right... :/");

        			logCmd(msg, `-exchange caught error: ${e}`);
        		}
        	});
        }
    },

    { // exchange help
        condition: function (msg) {
            return msg.content.match(/^\-exchange(?:\s|$)/);
        },
        act: async function (msg) {
            msg.channel.send(exchangeHelpInfo);
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
                //console.log(e);
        		logCmd(msg, "gave invalid /timezone");
                msg.channel.send("Invalid timezone\nSee: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List");
                msg.channel.send(timezoneHelpInfo);

            };
        }
    },

    { // exchange help
        condition: function (msg) {
            return msg.content.match(/^\-timezone(?:\s|$)/);
        },
        act: async function (msg) {
            msg.channel.send(timezoneHelpInfo);
        }
    },


];


const exchangeHelpInfo = { embed: {
    title: "-exchange Help",
    description: "-exchange accesses real time exchange rates to make prices in the desired units",
    fields: [
        {
            name: "Useage",
            value: "`-exchange <quantity> <from> <to>`"
        }, {
            name: "Examples",
            value: `This command is not case-sensitive and you can separate arguments if you wish.
\`-exchange 20 USD to EUR\`
\`-exchange 1 btc usd\`
\`-exchange 50gbpusd\`
            `
        }, {
            name: "Currency Symbols",
            value: "This command accepts [commonly used currency symbols](https://oxr.readme.io/docs/supported-currencies)"
        }
    ]
}};

const timezoneHelpInfo = { embed: {
    title: "-timezone Help",
    description: "-timezone tells the local time in a given timezone",
    fields: [
        {
            name: "Useage",
            value: "`-timezone <timezone>`"
        }, {
            name: "Examples",
            value: `
\`-timezone America/New_York\` - gives time on US the east coast
\`-timezone UTC-5\` - gives time in Eastern Standard time (note, doesn't account for [DST](https://en.wikipedia.org/wiki/Daylight_saving_time))
\`-timezone Cuba\` - some countries have their own timezone entry
            `
        }, {
            name: "Zones",
            value: "This command supports all timezones, however they might not \
be named what you expect. Use [this list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) for reference."
        }

    ]
}};
