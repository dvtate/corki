

/// Modified version of https://github.com/medimatrix/twitch.tv/blob/master/index.js

const request = require("request");

// todo: convert to use promises...

module.exports = function getAPI(apiMethod, options, callback) {
	let baseUrl = "https://api.twitch.tv/kraken/";

	if (typeof options === "function") {
		callback = options;
		options = null;
	}

	options = options || {};

	baseUrl = options.baseUrl || baseUrl;

	let headers = {
		"User-Agent": options.ua || "node.js twitch.tv by mediremi",
		"Accept": "application/vnd.twitchtv.v" + (options.apiVersion || "3") + "+json",
		"Client-ID": options.clientID || ""
	};

	if (typeof options.auth === "string")
		headers["Authorization"] = "OAuth " + options.auth;

	request({
		url: baseUrl + apiMethod,
		headers: headers
	}, function(error, response, body) {
        // errors during request
        if (error)
            return callback(error, null);

		// catch JSON parse errors
		try {
			var parsedBody = JSON.parse(body);
		} catch(e) {
			return callback(e, null);
		}

		// API returned a success
		if (response.statusCode == 200)
			callback(null, parsedBody);

		// API returned an error
		else
			callback(parsedBody, null);


	})
}
