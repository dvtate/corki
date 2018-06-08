/*
* Corki bot does not log messages or store any personal informaiton.
* Logging is only here to:
* - help the devs figure out who to inquire when user input causes bugs
* - provide some useage statistics
*/


const fs = require("fs");



// Function to simplify logging
module.exports = async function (msg, logMessage) {

    // current date
    const timestamp = new Date(Date.now());

    // full log entry
	const entry = `${timestamp}: @${msg.author.username} ${logMessage}`;

    // add to logfile
    fs.appendFile(`${process.env.HOME}/.corki/useage.log`, entry + '\n', (err) => {
		if (err)
			throw err;
		console.log(entry);
    });
}
