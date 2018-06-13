const fs = require("fs");
const Teemo = require("teemojs");



// riot api
const riotAPIToken = `${fs.readFileSync(`${process.env.HOME}/.corki/riot_key`)}`.trim();
module.exports.riot = new Teemo(riotAPIToken);

// champgg api
const champGGToken = `${fs.readFileSync(`${process.env.HOME}/.corki/champgg_key`)}`.trim();
module.exports.champgg = new Teemo(champGGToken, {
  "prefix" : "http://api.champion.gg",
  "retries" : 3,
  "maxConcurrent" : 2000,
  "distFactor" : 1,
  "defaultBuckets" : [{
    "timespan" : 600000,
    "limit" : 3000
  }, {
    "timespan" : 10000,
    "limit" : 50
  }],
  "rateLimitTypeApplication" : {
    "name" : "application",
    "headerLimit" : null,
    "headerCount" : "x-rate-limit"
  },
  "rateLimitTypeMethod" : null,
  "defaultRetryAfter" : 10,
  "headerRetryAfter" : "retry-after",
  "headerLimitType" : null,
  "defaultLimitType" : "application",
  "keyHeader" : null,
  "keyQueryParam" : "api_key",
  "collapseQueryArrays" : true,
  "endpoints" : {
    "champion" : {
      "getAllChampions" : "/v2/champions",
      "getChampionMatchupsByRole" : "/v2/champions/%s/%s/matchups?limit=800",
      "getChampionMatchups" : "/v2/champions/%s/matchups?limit=800",
      "getChampion" : "/v2/champions/%s"
    },
    "general" : "/v2/general",
    "overall" : "/v2/overall"
  }
});


// server names for teemo
module.exports.serverNames = {
    "br"  : "br1", "eune" : "eun1", "euw" : "euw1",
    "jp"  : "jp1", "kr"  : "kr",   "lan" : "la1",
    "las" : "la2",  "na" : "na1",  "oce" : "oc1",
    "tr"  : "tr1", "ru"  : "ru1",  "pbe" : "pbe1"
};


// edit when new champs come out
// this might actually have flaws, maybe ``[{ key, id }, {}, ...]` better
module.exports.champIDs = {
	"wukong" : 62, "jax" : 24, "fiddlesticks" : 9, "shaco" : 35, "warwick" : 19,
    "xayah" : 498, "nidalee" : 76, "zyra" : 143, "kled" : 240, "brand" : 63, "rammus" : 33,
    "illaoi" : 420, "corki" : 42, "braum" : 201, "darius" : 122, "tryndamere" : 23,
    "missfortune" : 21, "yorick" : 83, "xerath" : 101, "sivir" : 15, "riven" : 92,
    "orianna" : 61, "gangplank" : 41, "malphite" : 54, "poppy" : 78, "lissandra" : 127,
    "jayce" : 126, "nunu" : 20, "trundle" : 48, "karthus" : 30, "graves" : 104,
    "zoe" : 142, "gnar" : 150, "lux" : 99, "shyvana" : 102, "renekton" : 58, "fiora" : 114,
    "jinx" : 222, "kalista" : 429, "fizz" : 105, "kassadin" : 38, "sona" : 37, "irelia" : 39,
    "viktor" : 112, "rakan" : 497, "kindred" : 203, "cassiopeia" : 69, "maokai" : 57,
    "ornn" : 516, "thresh" : 412, "kayle" : 10, "hecarim" : 120, "khazix" : 121,
    "olaf" : 2, "ziggs" : 115, "syndra" : 134, "drmundo" : 36, "karma" : 43, "annie" : 1,
    "akali" : 84, "volibear" : 106, "yasuo" : 157, "kennen" : 85, "rengar" : 107,
    "ryze" : 13, "shen" : 98, "zac" : 154, "talon" : 91, "swain" : 50, "bard" : 432,
    "sion" : 14, "vayne" : 67, "nasus" : 75, "kayn" : 141, "twistedfate" : 4, "chogath" : 31,
    "udyr" : 77, "lucian" : 236, "ivern" : 427, "leona" : 89, "caitlyn" : 51, "sejuani" : 113,
    "nocturne" : 56, "zilean" : 26, "azir" : 268, "rumble" : 68, "morgana" : 25,
    "taliyah" : 163, "teemo" : 17, "urgot" : 6, "amumu" : 32, "galio" : 3, "heimerdinger" : 74,
    "anivia" : 34, "ashe" : 22, "velkoz" : 161, "singed" : 27, "skarner" : 72, "varus" : 110,
    "twitch" : 29, "garen" : 86, "blitzcrank" : 53, "masteryi" : 11, "elise" : 60,
    "alistar" : 12, "katarina" : 55, "ekko" : 245, "mordekaiser" : 82, "lulu" : 117,
    "camille" : 164, "aatrox" : 266, "draven" : 119, "tahmkench" : 223, "pantheon" : 80,
    "xinzhao" : 5, "aurelionsol" : 136, "leesin" : 64, "taric" : 44, "malzahar" : 90,
    "kaisa" : 145, "diana" : 131, "tristana" : 18, "reksai" : 421, "vladimir" : 8,
    "jarvaniv" : 59, "nami" : 267, "jhin" : 202, "soraka" : 16, "veigar" : 45,
    "janna" : 40, "nautilus" : 111, "evelynn" : 28, "gragas" : 79, "zed" : 238,
    "vi" : 254, "kogmaw" : 96, "ahri" : 103, "quinn" : 133, "leblanc" : 7, "ezreal" : 81,
    "pyke" : 555, "jarvan4" : 59
};


// champ names is the same as champ id's but key-value swapped
module.exports.champNames = {};
for (key in module.exports.champIDs)
    module.exports.champNames[module.exports.champIDs[key]] = key;

// both sides of the dict
module.exports.champs = Object.assign({}, module.exports.champIDs, module.exports.champNames);
