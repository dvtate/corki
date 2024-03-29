
const c_general = [
    {
        name: "-help",
        usage: "<p>View a list of help commands to help you get started with the bot. This page is more up to date.</p>",
        args: "takes no arguments",
        example: "<kbd>-help</kbd>"
    }, {
        name: "-about",
        usage: "<p>Give some general information about Corki bot</p>",
        args: "takes no arguments",
        example: "<kbd>-about</kbd>"
    }
];

const c_fun = [
    {
        name: "-8ball",
        usage: "<p>answers yes, no or maybe</p>",
        args: "optional question<br/><kbd>-8ball [question]</kbd>",
        example: "<kbd>-8ball Are yordles better than humans?</kbd>"
    }, {
        name: "-xkcd",
        usage: "<p>sends comic from <a href=\"https://xkcd.com\">xkcd.com</a></p>",
        args: `<kbd>-xkcd [comic# | latest]</kbd>
<ul>
    <li><b>no arguments:</b> sends a random comic</li>
    <li><b>number:</b> sends given comic number</li>
    <li><b>"latest":</b> sends most recent comic</li>
</ul>
        `,
        example: `
<kbd>-xkcd</kbd><br/>
<kbd>-xkcd 221</kbd><br/>
<kbd>-xkcd latest</kbd>
        `
    }, {
        name: "-roulette<br/><div class=\"mod-box\">Mod</div>",
        usage: "<p>mentions a random member of the server</p>",
        args: "takes no arguments",
        example: "<kbd>-roulette</kbd>"
    }, {
        name: "-urban",
        usage: "<p>look something up on urban dictionary</p>",
        args: "expects term to find<br/><kbd>-urban &lt;term></kbd>",
        example: "<kbd>-urban wat</kbd>"
    }
];


const c_lol = [
    {
        name: "-lol add",
        usage: "<p>Make Corki associate the given League of Legends account with you</p>",
        args: `<kbd>-lol add &lt;region-code> &lt;summoner name></kbd>
<ul>
    <li><b>region code:</b> server the account is on (na, euw, lan, las, eune, kr, jp, oce, tr, etc.)</li>
    <li><b>summoner name:</b> user ign</li>
</ul>`,
        example: `
        <kbd>-lol add na imaqtpie</kbd><br/>
        <kbd>-lol add kr hide on bush</kbd><br/>
        <kbd>-lol add kr hideonbush</kbd>`
    }, {
        name: "-lol list",
        usage: "<p>List League of Legends accounts corki associates with your account (or someone elses)",
        args:`<ul>
    <li>no arguments: list your accounts</li>
    <li>@mention: list another users accounts</li>
</ul>`,
        example: "<kbd>-lol list</kbd><br/><kbd>-lol list @testuser</kbd>"
    }, {
        name: "-lol main",
        usage: "<p>Tell corki which account is your main account</p>",
        args: "account number (use <kbd>-lol list</kbd> to get)",
        example: "<kbd>-lol main 0</kbd>"
    }, {
        name: "-lol mastery",
        usage: "<p>Provides champion mastery info</p>",
        args: `
<kbd>-lol mastery &lt;champion-name></kbd>: your total mastery points on a champion<br/>
<kbd>-lol mastery &lt;champion-name> @mention</kbd>: total mastery points of @mention'd user<br/>
<kbd>-lol mastery &lt;champion-name> &lt;server-name> &lt;summoner-name></kbd>: specific summoner's champion mastery<br/>
<kbd>-lol mastery</kbd>: omit arguments to see command help info<br/>
<ul>
    <li>for a list of server names use <code>lol -servers</code></li>
    <li>champion names should omit spaces and special characters (ie- kaisa, drmundo, missfortune)</li>
</ul>`,
        example: `
            <kbd>-lol mastery corki</kbd><br/>
            <kbd>-lol mastery janna @testuser</kbd><br/>
            <kbd>-lol mastery zed kr hide on bush</kbd>`
    }, {
        name: "-lol rank",
        usage: "<p>Show ranked progress</p>",
        args: `
<kbd>-lol rank</kbd>: ranked info for your main account<br/>
<kbd>-lol rank [acct # | all]</kbd>: ranked info for given acct number or all of your accts
<kbd>-lol rank @mention</kbd>: ranked info for @mention'd user<br/>
<kbd>-lol rank &lt;server-name> &lt;summoner-name></kbd>: ranked info for a specific summoner
<ul><li>for a list of server names use <code>lol -servers</code></li></ul>
        `,
        example: `
            <kbd>-lol rank</kbd><br/>
            <kbd>-lol rank @testuser</kbd><br/>
            <kbd>-lol rank na TF Blade</kbd>`
    }, {
        name: "-lol reset",
        usage: "<p>unlink all League of Legends accounts</p>",
        args: "takes no arguments",
        example: "<kbd>-lol reset</kbd>"
    }, {
        name: "-lol leaderboard",
        usage: "<p>Ranks server members by mastery points on given champion and shows top ten</p>",
        args: "champion name<br/><kbd>-lol leaderboard &lt;championname></kbd>",
        example: "<kbd>-lol leaderboard corki</kbd><br/><kbd>-lol lb draven</kbd>"
    }, {
        name: "-lol global leaderboard",
        usage: "<p>Shows leaderboard for masterypoints on a champion including all of corki users with accounts</p>",
        args: "champion name<br/><kbd>-lol leaderboard &lt;championname></kbd>",
        example: "<kbd>-lol global leaderboard corki</kbd><br/><kbd>-lol glb lb</kbd>"
    }, {
        name: "-lol servers",
        usage: "<p>Shows a list of supported League of Legends servers</p>",
        args: "takes no arguments",
        example: "<kbd>-lol servers</kbd>"
    }, {
        name: "-lol wr",
        usage: "<p>Show average winrate for a given champion using data from <a href=\"https://champion.gg/\">champion.gg</a>.</p>",
        args: "champion name (excluding spaces and special characters)<br/><kbd>-lol wr &lt;champ-name></kbd>",
        example: "<kbd>-lol wr corki</kbd>"
    }, {
        name: "-lol matchup",
        usage: "<p>Give statistics to for different lane matchups</p>",
        args: `
<kbd>-lol matchup &lt;lane/role> &lt;champ1-name> &lt;champ2-name></kbd>: matchup for specific role<br/>
<kbd>-lol matchup &lt;champ1-name> &lt;champ2-name></kbd>: all matchups
        `,
        example: "<kbd>-lol matchup mid zed yasuo</kbd><br/><kbd>-lol matchup lucian zed</kbd><br/><kbd>-lol matchup anivia vs. corki</kbd>"
    }, {
        name: "-lol masteries",
        usage: "<p>Show top 10 mastered champions<p>",
        args: `
        <kbd>-lol masteries</kbd>: info for all of your accounts<br/>
        <kbd>-lol masteries @mention</kbd>: info for @mention'd user's account<br/>
        <kbd>-lol masteries &lt;server-name> &lt;summoner-name></kbd>: info for a specific summoner
        <ul><li>for a list of server names use <code>lol -servers</code></li></ul>
        `,
        example: `<kbd>-lol masteries</kbd><br/>
<kbd>-lol masteries @testuser</kbd><br/>
<kbd>-lol masteries kr hide on bush</kbd>`
    }, {
        name: "-lol mastery7",
        usage: "<p>List mastery seven champs</p>",
        args: `
        <kbd>-lol mastery7</kbd>: info for all of your accounts<br/>
        <kbd>-lol mastery7 @mention</kbd>: info for @mention'd user's account<br/>
        <kbd>-lol mastery7 &lt;server-name> &lt;summoner-name></kbd>: info for a specific summoner
        <ul><li>for a list of server names use <code>lol -servers</code></li></ul>
        `,
        example: `<kbd>-lol mastery7</kbd><br/>
<kbd>-lol m7 @testuser</kbd><br/>
<kbd>-lol mastery7 kr hide on bush</kbd>`
    }, {
        name: "-lol refresh",
        usage: "<p>Refresh cached data associated with your LoL accounts. (champion mastery points, summoner name, etc.)</p>",
        args: "takes no arguments",
        example: "<kbd>-lol refresh</kbd>"
    }, {
        name: "-lol meta",
        usage: "<p>Shows meta picks in given elo based on champion.gg's data</p>",
        args: `
<kbd>-lol meta</kbd>: shows meta picks in platinum+</kbd>
<kbd>-lol meta&lt;elo></kbd>: shows meta picks in given elo</kbd>
        `,
        example: "<kbd>-lol meta<kbd><br/><kbd>-lol meta silver</kbd>"
    }
];

const c_international = [
    {
        name: "-exchange",
        usage: "<p>Uses real time exchange rates to convert prices to the desired currency</p>",
        args: `<kbd>-exchange &lt;quantity> &lt;from> &lt;to></kbd><br/>
<ul>
    <li><b>quantity:</b> quantity of given currency</li>
    <li><b>from:</b> given currency <a href="https://oxr.readme.io/docs/supported-currencies">symbol</a></li>
    <li><b>to:</b> desired currency <a href="https://oxr.readme.io/docs/supported-currencies">symbol</a></li>
    <li><a href="https://oxr.readme.io/docs/supported-currencies">currency symbols</a> aren't case-sensitive and don't need to be separated</li>
</ul>
        `,
        example: `
<kbd>-exchange 20 USD to EUR</kbd><br/>
<kbd>-exchange 1 btc usd</kbd><br/>
<kbd>-exchange 50gbpusd</kbd>
        `
    }, {
        name: "-timezone",
        usage: "<p>Tells local time in given timezone</p>",
        args: `desired timezone<br/><kbd>-timezone &lt;timezone></kbd>
<ul>
    <li>Timezone can be in <a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List">tz database</a></li>
    <li>Timezone can be an offset of UTC/GMT</li>
</ul>`,
        example: `
<kbd>-timezone America/New_York</kbd><br/>
<kbd>-timezone UTC+5</kbd><br/>
<kbd>-timezone GMT-5</kbd><br/>
<kbd>-timezone Cuba</kbd>
        `
    }
];

// server automation and management commands
const c_sam = [
    {
        name: "-iam",
        usage: "<p>Self-assign server role</p>",
        args: `Desired server role(s)<br/>
<kbd>-iam &lt;role(s)></kbd><br/>
<b>note:</b> roles are case-sensitive`,
        example: `<kbd>-iam Gamer</kbd><br/>
<kbd>-iam Nerd, Geek</kbd>`
    }, {
        name: "-iamnot",
        usage: "<p>remove self-assignable role</p>",
        args: `Un-desired server role(s)<br/>
<kbd>-iamnot &lt;role(s)></kbd><br/>
<b>note:</b> roles are case-sensitive`,
        example: `<kbd>-iamnot weeaboo</kbd><br/>
<kbd>-iamnot Scammer, Unicorn Lover</kbd>`
    }, {
        name: "-sar add<br/><div class=\"mod-box\">Mod</div>",
        usage: "<p>makes given role self-assignable</p><b>(requires MANAGE_ROLES permission)</b>",
        args: "self-assignable role(s)<br><kbd>-add-assignable-role &lt;role(s)>",
        example: `<kbd>-sar add dota2</kbd><br/>
        <kbd>-sar add NA, EUW, LAN, LAS</kbd>`
    }, {
        name: "-sar reset<br/><div class=\"mod-box\">Mod</div>",
        usage: "<p>resets list of self-assignable roles</p>",
        args: "takes no arguments",
        example: "<kbd>-sar reset</kbd>"
    }, {
        name: "-rss add<br/><div class=\"mod-box\">Mod</div>",
        usage: "<p>forward all new post from an rss feed to this channel (see <kbd>-help rss</kbd> for more)</p>",
        args: "rss feed url<br/><kbd>-rss &lt;url></kbd>",
        example: "<kbd>-rss add https://reddit.com/r/leagueoflegends/new/.rss"
    }, {
        name: "-rss reset<br/><div class=\"mod-box\">Mod</div>",
        usage: "<p>unsubscribe this channel from all rss feeds</p>",
        args: "takes no arguments",
        example: "<kbd>-rss reset</kbd>"
    }, {
        name: "-rss list",
        usage: "<p>show all subscriptions for current channel</p>",
        args: "takes no arguments",
        example: "<kbd>-rss list</kbd>"
    }, {
        name: "-announce-new-members<br/><div class=\"mod-box\">Mod</div>",
        usage: "<p>Make an announcement every time a new member joins the server</p>",
        args: `optionally accepts a message template.<br/>
<kbd>-announce-new-members [announcement-tempalte]
        `,
        example: `
<kbd>-announce-new-members</kbd><br/>
<kbd>-announce-new-members Welcome to {{server}} {{user}}</kbd>
        `
    }, {
        name: "-prefix add<br/><div class=\"mod-box\">Mod</div>",
        usage: "<p>Allow commands with a different prefix to be processed by corki</p>",
        args: `new prefix<br/>
<kbd>-prefix add &lt;prefix></kbd>
        `,
        example: `
<kbd>-prefix add +</kbd><br/>
<kbd>-prefix add can u pls</kbd>`
    }, {
        name: "-prefix list",
        usage: "<p>Show a list of all prefixes configured for given server</p>",
        args: "takes no arguments",
        example: "<kbd>-prefix list</kbd>"
    }, {
        name: "-prefix reset<br/><div class=\"mod-box\">Mod</div>",
        usage: "<p>Reset custom prefixes in server back to defaults (@mention and '-')</p>",
        args: "takes no arguments",
        example: "<kbd>-prefix reset</kbd>"
    }, {
        name: `-prefix set<br/><div class=\"mod-box\">Mod</div>`,
        usage: "<p>Only accept commands with given prefix in this server (Corki also accepts commands starting with a mention)</p>",
        args: "new prefix<br/>\
<kbd>-prefix set &lt;prefix></kbd>",
        example: "<kbd>-prefix set ;</kbd>"
    }, {
        name: "-msg<br/><div class=\"mod-box\">Mod</div>",
        usage: "<p>Use the bot to send a message to a different channel</p>",
        args: `<kbd>-msg &lt;channel> &lt;message></kbd><br/>
<ul>
    <li><b>channel:</b> the channel id of the destination channel (use <code>-log channel</code> to find)</li>
    <li><b>message:</b> message contents</li>
</ul>`,
        example: "<kbd>-msg 1234 hello there</kbd>"
    }, {
        name: "-blacklist",
        usage: "Prevent Corki from reading messages in the server/channel the command is sent in",
        args: "<kbd>server</kbd> or <kbd>channel</kbd>, whichever you wish to blacklist",
        example: "<kbd>-blacklist server</kbd><br/><kbd>-bl channel</kbd>"
    }, {
        name: "-blacklist remove",
        usage: "Allow corki to read messages again. (send via dm or non-blacklisted channel)",
        args: "accepts the id of relevant server/channel (accessable via right-click menu)",
        example: "<kbd>-blacklist remove 319518724774166531</kbd>"
    },
];


const c_tools = [
    {
        name: "-spell",
        usage: "<p>Uses the military phonetic alphabet to spell a given word</p>",
        args: "given word<br/><kbd>-spell &lt;word></kbd>",
        example: "<kbd>-spell kappa</kbd>"
    }, {
        name: "-vaporwave",
        usage: "<p>Applies vaporwave aesthetic to given text, converting it to full-width</p>",
        args: "given text<br/><kbd>-vaporwave &lt;text></kbd>",
        example: "<kbd>-vaporwave aesthetic</kbd>"
    }, {
        name: "-glitch",
        usage: "<p>Adds characters to given text to make text appear glitchy",
        args: "given text<br/><kbd>-glitch &lt;text></kbd>",
        example: "<kbd>-glitch 4edgy 2me</kbd>"
    }, {
        name: "-flip",
        usage: "<p>Flips given text upside down</p>",
        args: "given text<br/><kbd>-flip &lt;text></kbd>",
        example: "<kbd>-flip my life</kbd>"
    }, {
        name: "-tinycaps",
        usage: "<p>Writes text in tinycaps</p>",
        args: "given text<br/><kbd>-tinycaps &lt;text></kbd>",
        example: "<kbd>-tinycaps I'm quietly screaming</kbd>"
    }, {
        name: "-mirror",
        usage: "<p>Sends the mirror image of your text, (as text)</p>",
        args: "given text<br/><kbd>-mirror &lt;text></kbd>",
        example: "<kbd>-mirror something</kbd>"
    }, {
        name: "-echo",
        usage: "<p>repeats a given message</p>",
        args: "message to repeat<br><kbd>-echo &lt;message></kbd>",
        example: "<kbd>-echo repeat after me</kbd><br><kbd>-echo -echo -echo hehe x3</kbd>"
    }, {
        name: "-coinflip",
        usage: "<p>sends heads or tails</p>",
        args: "takes no arguments",
        example: "<kbd>-coinflip heads i win tails u loose</kbd><br><kbd>-coinflip</kbd>"
    }, {
        name: "-random",
        usage: "<p>Use an RNG to generate a whole number on a given range</p>",
        args: `
<kbd>-random &lt;a> &lt;b></kbd>: generate a random number between a & b inclusive <br/>
<kbd>-random &lt;a></kbd>: generate a random number n where 0 &le; n &lt; a <br/>
<ul>
    <li>running this command without arguments provides this help entry</li>
    <li>arguments can be separated by spaces or commas</li>
</ul>
        `,
        example: `
<kbd>-random 10</kbd>: random base 10 numeral<br/>
<kbd>-random 0 100</kbd>: random test grade<br/>
<kbd>-random 0,100</kbd>: same as above but commas
        `
    }, {
        name: "-dictionary terms",
        usage: "<p>sends list of defined terms</p>",
        args: "takes no arguments",
        example: "<kbd>-dictionary terms</kbd>"
    }, {
        name: "-define",
        usage: "<p>Gives definition of the given term</p><p>Sets definition for given term</p> <p>run <kbd>-help dictionary</kbd> for more on setting definitions",
        args: `
<kbd>-define &lt;term></kbd>: define given term <br/>
<kbd>-define &lt;term>
&lt;definition></kbd>: set definition for given term (note definition on new line)`,
        example: "<kbd>-define mods</kbd><br/>"
    },

];

const c_devtools = [
    {
        name: "-log",
        usage: "<p>Share commonly needed information which the bot has access to</p>",
        args: `<kbd>-log [help|guild|members|channel|user [@mention]|bot]</kbd>
<p>Different arguments produce different information</p>`,
        example: "<kbd>-log help</kbd>"
    }, {
        name: "-ping",
        usage: "<p>Used to make sure the bot is online and/or to test a connection",
        args: "takes no arguments",
        example: "<kbd>-ping</kbd>"
    }, {
        name: "-bug",
        usage: "<p>Alerts the bot developers that something needs to be fixed</p>",
        args: "message to the developer to give an idea of whats wrong and/or what you want to see",
        example: "<kbd>-bug the bot isn't responding to -ping and shows as offline</kbd>"
    }, {
        name: "-feature-request",
        usage: "<p>Shows a list of requested features for the bot, feel free to add your ideas</p>",
        args: "takes no arguments",
        example: "<kbd>-feature-request</kbd>"
    }, {
        name: "-system",
        usage: "<p>Runs BASH code on the bot's server</p><br/><b>(requires BotAdmin priveleges)</b>",
        args: "requires shell command to run",
        example: "<kbd>-system uname -a</kbd>"
    }, {
        name: "-eval",
        usage: "<p>Runs Node.JS code, useful for prototyping commands</p><br/>\
<b>(requires BotAdmin priveleges)</b>",
        args: "JavaScript code",
        example: "<kbd>-eval console.log(Date.now())</kbd>"
    }, {
        name: "-uptime",
        usage: "<p>Shows how long Corki has been running since last restarted</p>",
        args: "takes no arguments",
        example: "<kbd>-uptime</kbd>"
    }, {
        name: "-lol api",
        usage: "<p>Make a Riot API call through corki</p><br/><b>(requires BotAdmin priveleges)</b>",
        args: "api call arguments",
        example: "<kbd>-lol api na1 summoner.getBySummonerName ridderhoff</kbd>"
    }, {
        name: "-err",
        usage: "<p>Make corki throw an error</p>",
        args: "string to throw",
        example: "<kbd>-err this is just a test</kbd>"
    }, {
        name: "-deformat",
        usage: "<p>send raw text of given message<p>",
        args: "message contents",
        example: "<kbd>-deformat @testuser</kbd>"
    }, {
        name: "-reformat",
        usage: "<p>format raw text into a message (opposite of -deformat)</p>",
        args: "raw text enclosed in <kbd>`</kbd>'s",
        example: "<kbd>-reformat `<@332958493722017792>`</kbd>"
    },
];

commands = {
    "general" : c_general,
    "fun" : c_fun,
    "lol" : c_lol,
    "international" : c_international,
    "sam" : c_sam,
    "tools" : c_tools,
    "devtools" : c_devtools
};


function addMulti(cmd_obj, categories) {
    categories.forEach(cat => commands[cat].push(cmd_obj));
}

/*
addMulti({

}, [ ]);
*/
