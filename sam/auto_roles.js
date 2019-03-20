
/*
// data in
guild_join_date()               when did they join the guild
bot_join_date()                 when did corki join the guild
date(date string)               date/amount of time in given string
    // also will need to add in date("2 days")

current_date()                  what is date today?
lol_mastery_pts(champ ID)       how many mastery points do they have on given champid?
lol_max_rank()                  what is their max rank?
lol_has_rank()                  do they have an account in this rank? (should be allowed to specify division, but not required)


// logical operators
            and, or, not, xor

// cmp
// need to make LoL ranks comparable
            >, <, >=, <=, ==, !=

//
*/

// process date command
function get_date(str) {
    if (!str)
        return Date.parse(Date());

    const ret = Date.parse(str);

    // not handled by default so we convert manually
    if (!ret || ret == NaN) {
		const ms_value = t => {
    		if (t == "year" || t == "years" || t == "yr" || t == "yrs")
    			return 1000 * 60 * 60 * 24 * 365;
    		if (t == "day" || t == "days")
    			return 1000 * 60 * 60 * 24;
			if (t == "hour" || t == "hours" || t == "hrs" || t == "hr")
				return 1000 * 60 * 60;
    		if (t == "min" || t == "mins" || t == "minutes" || t == "mins")
    			return 1000 * 60;
			//console.log("invalid label");
    		return NaN;

        };

        // split string into [1, year, 6, days, 2, hours, ...]
        const tokenize = s => {
            // "6years2days",1 => "years"
            const getTok = (s, i) => {
                const numerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'];
                const isDig = numerals.includes(s[i]);
                const start = i;
                while (i < s.length && numerals.includes(s[i]) == isDig)
			        i++;

                return s.slice(start, i);
            };

	        let ret = [];
            let i = 0;
            while (i < s.length) {
                const tok = getTok(s, i);
                i += tok.length;
                ret.push(tok);
            }
            return ret;
        };

        str = str.replace(/\s/, "");
        let ret = 0;

        // process tokens
        tokenize(str).forEach((tok, ind, arr) => {
            if (isNaN(tok)) // days, weeks, etc.
                if (!arr[ind - 1] || isNaN(arr[ind - 1]))
                    ret += ms_value(tok);
                else if (!isNaN(arr[ind - 1]))
                    ret += JSON.parse(arr[ind - 1]) * ms_value(tok);
        });
        return ret;
    }

    return ret;
}

function lol_rank_diff(r1, r2) {
    const tiers = [ 'i', 'b', 's', 'g', 'p', 'd', 'm', 'gm', 'c' ];
    const divs  = [ '4', '3', '2', '1' ];

    // "G4" => ['g', '4']
    const split = r => {
        const numerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'];
        let i = 0;
        while (i < r.length && !numerals.includes(r[i]))
            i++;

        return [ r.slice(0, i), r.slice(i) ];
    };

    r1 = split(r1.toLowerCase());
    r2 = split(r2.toLowerCase());
    console.log(r1, r2);

    // relative value
    const t1 = tiers.findIndex(v => v == r2[0]) >= 0 ?
        tiers.findIndex(v => v == r2[0]) : NaN;
    const t2 = tiers.findIndex(v => v == r1[0]) >= 0 ?
        tiers.findIndex(v => v == r1[0]) : NaN;

    let cmp_r = t1 - t2;
    if (cmp_r) // nomalize
        cmp_r /= Math.abs(cmp_r);

    // difference in divions only significant if specified in both
    let cmp_d = 0;
    if (r1[1] && r2[1]) {
        // relative value
        const d1 = divs.findIndex(v => v == r2[1]) >= 0 ?
            divs.findIndex(v => v == r2[1]) : NaN;
        const d2 = divs.findIndex(v => v == r1[1]) >= 0 ?
            divs.findIndex(v => v == r1[1]) : NaN;

        cmp_d = d1 - d2;
        if (cmp_d) // normalize
            cmp_d /= Math.abs(cmp_d);
    }
    return cmp_r * 10 + cmp_d * 0.1;
}

function cmp(item1, item2) {
        if (typeof(item1) != typeof(item2)) {
            return NaN; // error
        }

        const cmp_lol_rank = (r1, r2) => {

        };

        if (typeof(item1) == "string")
            return rank_diff(item1, item2);

}

function guild_join_date(g, u) {
    return global.client.guilds.get(g).members.get(u).joinedAt;
}

function parseCondition(guildId, userId, expr) {
    // User will be able to input expressions like:
    // make a role appear after 5 weeks
    date("2019-1-2") - date() > date("5 weeks")

    // ast too hard,
    const cmds = {
        "date" : get_date,           // also without args evaluates to current date (can be used to store server creation date)
        "member_join_date" : todo,   // when did the user join the server
        "has_role" : todo,           // has a given role
        "lol_has_rank" : todo,       // has a given LoL rank
        "lol_has_queue_rank" : todo, // has a given LoL rank in a given ranked queue (ie- 3v3, flex, etc.)
        "lol_max_rank" : todo,       // user's maximum rank
        "lol_mastery_points" : todo, // number of points on given champ
        "lol_mastery_level" : todo,  // master level on given champ

    }
    const bln_ops = [ "and", "or", "not", "xor"];
    const num_ops = [ ">", "<", ">=", "<=", "==", "!=", "+", "-", "*", "/" ];


    // parens
    // strings
    //

    // replace function calls with values
    // parse parens

    // convert to rpn?
    // recursion to parse parens?

}
