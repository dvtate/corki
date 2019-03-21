
/*

I'd like to eventually make this a scratch.mit.edu like drag-and-drop system,
but currently I only have time to do an rpn-based expression parser
in the future I should be able to make a gui which generates/renders rpn expressions

*/


// process date command
function get_date(stack) {
    let str = stack.pop();
    if (typeof(str) == "number")
        return Date.parse(new Date(str));

    if (!str || typeof(str) != "string" || str.length == 0)
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
		console.log("cmp: ", typeof(item1), typeof(item2));
        if (typeof(item1) == "string")
            return lol_rank_diff(item1, item2);
		if (typeof(item1) == "number")
			return item2 - item1;
}
function member_join_date(stack, guildId, userId) {
    return Date.parse(global.client.guilds.get("319518724774166531").members.get("436604134490243082").joinedAt);
}
function has_role(stack, guildId, userId) {
    const role = stack.pop();
    const guild = global.client.guilds.get(guildId);
    const member = guild.members.get(userId);
    if (typeof(role) == "number") { // role id ? find name
        return member.roles.get(role);
    }

    return !!member.roles.find(r => r.name == role);
}


const lol = require("../../lol/lol_stuff");
const teemo = require("../../lol/teemo");
const mastery = require("../../lol/user_mastery");

async function lol_mastery_points(stack, guildId, userId) {
    let champ = stack.pop();
    champ = teemo.champIDs[champ] || champ;
    const mdata = await mastery.getUserMastery(userId, champ);
    console.log("mdata:", mdata);
    return mdata.pts;
}
async function lol_mastery_level(stack, guildId, userId) {
    let champ = stack.pop();
    champ = teemo.champIDs[champ] || champ;
    const mdata = await mastery.getUserMastery(userId, champ);
    console.log("mdata:", mdata);
    return mdata.lvl;
}


function todo(stack) {
    return stack.pop();
}

const splitargs = require("splitargs");

// ast too hard, therefore rpn :D
const cmds = {
    // reference a specfic date
    "date" : get_date,
    // reference todays date
    "today" : stack => { stack.push(""); return get_date(stack); },
    // date that member joined server
    "member_join_date" : member_join_date,
    // member has given role
    "has_role" : has_role,
    // has given LoL rank?
    "lol_has_rank" : todo,
    // has given LoL rnak in given queue (3s, flexq, soloq)?
    "lol_has_queue_rank" : todo,
    // users highest rank
    "lol_max_rank" : todo,
    // user's highest rank in given queue
    "lol_max_queue_rank" : todo,
    // user's mastery score on given champ
    "lol_mastery_points" : lol_mastery_points,
    // mastery level on given champ (1-7)
    "lol_mastery_level" : lol_mastery_level,
    // has a lol acct on given regional sever?
    "lol_in_region" : todo,

    // bln ops
    "and" : stack => stack.pop() && stack.pop(),
    "or" : stack => stack.pop() || stack.pop(),
    "not" : stack => !stack.pop(),
    "xor" : stack => !!stack.pop() != !!stack.pop(),

    // cmp
    ">"  : stack => cmp(stack.pop(), stack.pop()) >  0,
    "<"  : stack => cmp(stack.pop(), stack.pop()) <  0,
    ">=" : stack => cmp(stack.pop(), stack.pop()) >= 0,
    "<=" : stack => cmp(stack.pop(), stack.pop()) <= 0,
    "==" : stack => cmp(stack.pop(), stack.pop()) == 0,
    "!=" : stack => cmp(stack.pop(), stack.pop()) != 0,

    // math ops
    "+" : stack => stack.pop() + stack.pop(), // should also work on strings
    "-" : stack => stack.pop() - stack.pop(),
    "*" : stack => stack.pop() * stack.pop(),
    "/" : stack => stack.pop() / stack.pop(),

};
module.exports.operators = cmds;

// returns final value or NaN on error
async function parseCondition(guildId, userId, expr) {

    const tokens = splitargs(expr, ' ', true);
    let stack = [];

    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        console.log("t:", t);
		console.log("stack:", stack);

		if (cmds[t]) {
            try {
                let ret = cmds[t](stack, guildId, userId);
                if (ret instanceof Promise)
                    ret = await ret;
    			stack.push(ret);
            } catch (e) {
                return Nan;
            }
		} else {
            try {
    			stack.push(JSON.parse(t));
    		} catch (e) {
    			return NaN;
    		};
        }
    }

	console.log("stack:", stack);
	return stack.pop();
}
module.exports.parseCondition = parseCondition;
