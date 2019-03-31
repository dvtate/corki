
/*

I'd like to eventually make this a scratch.mit.edu like drag-and-drop system,
but currently I only have time to do an rpn-based expression parser
in the future I should be able to make a gui which generates/renders rpn expressions

*/


// process date command
function get_date(stack) {
    let str = stack.pop();
    if (typeof(str) == "number")
        return str;

    if (!str || typeof(str) != "string" || str.length == 0)
        return Date.now();

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
                    ret += ms_value(tok); // "day"
                else if (!isNaN(arr[ind - 1]))
                    ret += JSON.parse(arr[ind - 1]) * ms_value(tok); // "6 days" == 6*day()
        });
        return ret;
    }

    return ret;
}
function cmp(item1, item2) {
        if (typeof(item1) != typeof(item2)) {
            return NaN; // error
        }
		//console.log("cmp: ", typeof(item1), typeof(item2));
        if (typeof(item1) == "string")
            return lol.rank.diff(item1, item2);
		if (typeof(item1) == "number")
			return item2 - item1;
}

function member_join_date(stack, guildId, userId) {
    return Date.parse(global.client.guilds.get(guildId).members.get(userId).joinedAt);
}
function has_role(stack, guildId, userId) {
    const role = stack.pop();
    const guild = global.client.guilds.get(guildId);
    const member = guild.members.get(userId);
    if (typeof(role) == "number") { // role id ? find name
        return !!member.roles.get(role);
    }
    if (typeof(role) == "string") {
        return !!member.roles.find(r => r.name == role);
    }
    else return false;
}


const lol = require("../../lol/lol_stuff");
const teemo = require("../../lol/teemo");
const mastery = require("../../lol/user_mastery");

async function lol_mastery_points(stack, guildId, userId) {
    let champ = stack.pop();
    champ = teemo.champIDs[champ] || champ;
    const mdata = await mastery.getUserMastery(userId, champ);
    //console.log("mdata:", mdata);
    return mdata.pts;
}
async function lol_mastery_level(stack, guildId, userId) {
    let champ = stack.pop();
    champ = teemo.champIDs[champ] || champ;
    const mdata = await mastery.getUserMastery(userId, champ);
    //console.log("mdata:", mdata);
    return mdata.lvl;
}

function todo(stack) {
    return stack.pop();
}

const user_rank = require("../../lol/user_rank");

async function lol_has_rank(stack, guildid, userid) {
    const rank = stack.pop(); // desired rank
    const rankdata = await user_rank.getData(userid);
    const keys = Object.keys(rankdata);

    for (let i = 0; i < keys.length; i++)
        for (let j = 0; j < rankdata[keys[i]].length; j++)
            if (lol.rank.diff(rank, rankdata[keys[i]][j]) == 0)
                return true;

    return false;
}

async function lol_has_rank_in_queue(stack, guildid, userid) {
    const rank = stack.pop(); // desired rank
    const queue = teemo.rankedQueues(tack.pop()); // in queue
    const rankdata = await user_rank.getData(userid);

    const ranks = rankdata[queue];


    if (ranks)
        for (let i = 0; i < ranks.length; i++)
            if (lol.rank.diff(rank, ranks[i]) == 0)
                return true;
    return false;

}

async function lol_max_rank(stack, guildid, userid) {
    const rankdata = await user_rank.getData(userid);
    let ranks = [];
    Object.keys(rankdata).forEach(k => {
        if (rankdata[k].length)
            rankdata[k].forEach(r => ranks.push(r));
    });
    return lol.rank.max(ranks);
}

async function lol_max_rank_in_queue(stack, guildid, userid) {
    const queue = teemo.rankedQueues(tack.pop()); // in queue
    const rankdata = await user_rank.getData(userid);
    const ranks = rankdata[queue];
    return lol.rank.max(ranks);
}

function lol_in_region(stack, guildid, userid) {
    const userObj = lol.getUserData(userid);
    const reg = stack.pop();
    return userObj && userObj.accounts && userObj.accounts.find(a =>
        a.server == reg || a.server == teemo.serverNames[reg]);
}

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
    "lol_has_rank" : lol_has_rank,
    // has given LoL rnak in given queue (3s, flexq, soloq)?
    "lol_has_queue_rank" : lol_has_rank_in_queue,
    // users highest rank
    "lol_max_rank" : lol_max_rank,
    // user's highest rank in given queue
    "lol_queue_max_rank" : todo,
    // user's mastery score on given champ
    "lol_mastery_points" : lol_mastery_points,
    // mastery level on given champ (1-7)
    "lol_mastery_level" : lol_mastery_level,
    // has a lol acct on given regional sever?
    "lol_in_region" : lol_in_region,

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


const splitargs = require("splitargs");

// returns final value or NaN on error
async function parseCondition(guildId, userId, expr) {

    const tokens = splitargs(expr, ' ', true);
    let stack = [];

    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        //console.log("t:", t);
		//console.log("stack:", stack);

		if (cmds[t]) {
            try {
                let ret = cmds[t](stack, guildId, userId);
                if (ret instanceof Promise)
                    ret = await ret;
    			stack.push(ret);
            } catch (e) {
                console.error(e);
                return NaN;
            }
		} else {
            try {
    			stack.push(JSON.parse(t));
    		} catch (e) {
                console.error(e);
    			return NaN;
    		};
        }
    }

	//console.log("stack:", stack);
	return stack.pop();
}
module.exports.parseCondition = parseCondition;
