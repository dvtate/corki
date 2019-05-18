
/*

I'd like to eventually make this a scratch.mit.edu like drag-and-drop system,
but currently I only have time to do an rpn-based expression parser
in the future I should be able to make a gui which generates/renders rpn expressions

*/


// process date command (pushes epoch ms onto stack)
function get_date(stack) {
    let str = stack.pop();

    // already epoch ms
    if (typeof(str) == "number")
        return str;

    // empty string arg ==> today's date
    if (!str || typeof(str) != "string" || str.length == 0)
        return Date.now();

    // attempt to parse date str
    const ret = Date.parse(str);

    // not handled by default so we convert manually
    if (!ret || ret == NaN) {
		const ms_value = t => {
    		if (t == "year" || t == "years" || t == "yr" || t == "yrs" || t == "y")
    			return 1000 * 60 * 60 * 24 * 365;
    		if (t == "day" || t == "days" || t == "d")
    			return 1000 * 60 * 60 * 24;
			if (t == "hour" || t == "hours" || t == "hrs" || t == "hr" || t == "h")
				return 1000 * 60 * 60;
    		if (t == "min" || t == "mins" || t == "minutes" || t == "minute" || t == "m")
    			return 1000 * 60;
			//console.log("invalid label");
    		return NaN;
        };

        // split string into [1, year, 6, days, 2, hours, ...]
        const tokenize = s => {
            // "6years2days",1 => "years"
            const getTok = (s, i) => { // string, offset
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

// compare 2 values
function cmp(item1, item2) {
        if (typeof(item1) != typeof(item2)) {
            return NaN; // error
        }
        if (typeof(item1) == "string")
            return lol.rank.diff(item1, item2);
		if (typeof(item1) == "number")
			return item2 - item1;
}

// epoch ms when user joined relevant guild
function member_join_date(stack, guildId, userId) {
    return Date.parse(global.client.guilds.get(guildId).members.get(userId).joinedAt);
}

// bool if user has given role
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

// League of Legends imports
const lol = require("../../lol/lol_stuff");
const teemo = require("../../lol/teemo");
const mastery = require("../../lol/user_mastery");

// number of points user has on a given champion
async function lol_mastery_points(stack, guildId, userId) {
    let champ = stack.pop();
    champ = teemo.champIDs[champ] || champ;
    const mdata = await mastery.getUserMastery(userId, champ);
    return mdata.pts;
}
// mastery level user has on given champ
async function lol_mastery_level(stack, guildId, userId) {
    let champ = stack.pop();
    champ = teemo.champIDs[champ] || champ;
    const mdata = await mastery.getUserMastery(userId, champ);
    return mdata.lvl;
}

// League of legends cached rank data
const user_rank = require("../../lol/user_rank");

// bool does user have an equivalent rank?
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

// bool does user have given rank in specfied queue?
async function lol_has_rank_in_queue(stack, guildid, userid) {
    const rank = stack.pop(); // desired rank
    const q = stack.pop();
    if (q == any) {
        stack.push(rank);
        return lol_has_rank(stack, guildid, userid);
    }
    const rankdata = await user_rank.getData(userid);
    const ranks = rankdata[teemo.rankedQueues(q)];
    if (ranks)
        for (let i = 0; i < ranks.length; i++)
            if (lol.rank.diff(rank, ranks[i]) == 0)
                return true;
    return false;

}

// string users highes rank
async function lol_max_rank(stack, guildid, userid) {
    const rankdata = await user_rank.getData(userid);
    let ranks = [];
    Object.keys(rankdata).forEach(k => {
        if (rankdata[k].length)
            rankdata[k].forEach(r => ranks.push(r));
    });
    return lol.rank.max(ranks);
}

// string users max rank in a given queue
async function lol_max_rank_in_queue(stack, guildid, userid) {
    const q = stack.pop();
    if (q == "any")
        return lol_max_rank(stack, guildid, userid);
    const rankdata = await user_rank.getData(userid);
    const ranks = rankdata[teemo.rankedQueues(q)];
    return lol.rank.max(ranks);
}

// does user have an account in the given region?
function lol_in_region(stack, guildid, userid) {
    const userObj = lol.getUserData(userid);
    const reg = stack.pop();
    return userObj && userObj.accounts && userObj.accounts.find(a =>
        a.server == reg || a.server == teemo.serverNames[reg]);
}

// ast waste of time here, therefore postfix style solution :D
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
    "lol_queue_has_rank" : lol_has_rank_in_queue,
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
    "+" : stack => stack.pop() + stack.pop(), // also works on strings (note: backwards)
    "-" : stack => stack.pop() - stack.pop(), // (note: backwards)
    "*" : stack => stack.pop() * stack.pop(),
    "/" : stack => stack.pop() / stack.pop(), // (note: backwards)
    "abs" : stack => Math.abs(stack.pop()),

};
module.exports.operators = cmds;

// using a command line argument parser as my tokenizer as it does what's needed
const splitargs = require("splitargs");

// returns final value or NaN on error
async function parseCondition(guildId, userId, expr) {
    // tokenize expr
    const tokens = splitargs(expr, ' ', true);
    let stack = []; // builtin array for stack

    // for each token
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        //console.log("t:", t);
        //console.log("stack:", stack);

        // operator?
        if (cmds[t]) {
            try {
                // run relevant command
                let ret = cmds[t](stack, guildId, userId);
                if (ret instanceof Promise)
                    ret = await ret;
                stack.push(ret);
            } catch (e) {
                console.error(e);
                return NaN;
            }

        // literal?
        } else if (t) {
            try {
                stack.push(JSON.parse(t));
            } catch (e) {
                console.error("Parse Error: ", t, e);
                return NaN;
            };
        } // else, empty string, no token
    }

    //console.log("stack:", stack);

    // return top of stack
    return stack.pop();
}
module.exports.parseCondition = parseCondition;
