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
module.exports.champNames = {};

// also include inverted keys/values
for (key in module.exports.serverNames)
    module.exports.serverNames[module.exports.serverNames[key]] = key;



// edit when new champs come out
module.exports.champIDs = {
	"wukong" : 62, "monkey" : 62,
    "jax" : 24,
    "fiddlesticks" : 9, "fidd" : 9, "fid" : 9, "fiddle" : 9,
    "shaco" : 35, "clown" : 35,
    "warwick" : 19, "ww" : 19,
    "xayah" : 498,
    "nidalee" : 76, "nid" : 76,
    "zyra" : 143, "kled" : 240, "brand" : 63, "rammus" : 33, "illaoi" : 420,
    "corki" : 42, "braum" : 201,
    "darius" : 122, "dunk" : 122,
    "tryndamere" : 23, "trynd" : 23,
    "missfortune" : 21, "mf" : 21,
    "yorick" : 83, "xerath" : 101, "sivir" : 15, "riven" : 92,
    "orianna" : 61, "ori" : 61,
    "gangplank" : 41, "pirate" : 41, "gp" : 41,
    "malphite" : 54, "rock" : 54, "malph" : 54,
    "poppy" : 78,
    "lissandra" : 127, "liss" : 127,
    "jayce" : 126,
    "nunu" : 20, "yeti" : 20,
    "trundle" : 48, "troll" : 48,
    "karthus" : 30, "karth" : 30,
    "graves" : 104, "cigar" : 104,
    "zoe" : 142, "gnar" : 150, "lux" : 99,
    "shyvana" : 102, "shyv" : 102,
    "renekton" : 58, "renek" : 58,
    "fiora" : 114, "jinx" : 222, "kalista" : 429,
    "fizz" : 105, "fish" : 105,
    "kassadin" : 38, "kass" : 38,
    "sona" : 37, "irelia" : 39, "viktor" : 112, "rakan" : 497, "kindred" : 203,
    "cassiopeia" : 69, "cass" : 69,
    "maokai" : 57, "mao" : 57,
    "ornn" : 516, "thresh" : 412, "kayle" : 10,
    "hecarim" : 120, "hec" : 120, "pony" : 120, "horse" : 120,
    "khazix" : 121, "bug" : 121, "zix" : 121, "k6" : 121,
    "olaf" : 2, "ziggs" : 115, "syndra" : 134,
    "drmundo" : 36, "mundo" : 36,
    "karma" : 43, "annie" : 1, "akali" : 84,
    "volibear" : 106, "voli" : 106,
    "yasuo" : 157, "yas" : 157,
    "kennen" : 85, "rengar" : 107, "ryze" : 13, "shen" : 98, "zac" : 154,
    "talon" : 91, "swain" : 50, "bard" : 432, "sion" : 14, "vayne" : 67,
    "nasus" : 75, "susan" : 75,
    "kayn" : 141,
    "twistedfate" : 4, "tf" : 4,
    "chogath" : 31, "cho" : 31,
    "udyr" : 77,
    "lucian" : 236, "luc" : 236,
    "ivern" : 427, "leona" : 89,
    "caitlyn" : 51, "cait" : 51,
    "sejuani" : 113, "sej" : 113,
    "nocturne" : 56, "noc" : 56,
    "zilean" : 26, "azir" : 268, "rumble" : 68, "taliyah" : 163,
    "morgana" : 25, "morg" : 25,
    "teemo" : 17, "satan" : 17,
    "urgot" : 6, "amumu" : 32, "galio" : 3,
    "heimerdinger" : 74, "heim" : 74, "donger" : 74,
    "anivia" : 34, "egg" : 34,
    "ashe" : 22, "velkoz" : 161, "singed" : 27, "skarner" : 72, "varus" : 110,
    "twitch" : 29, "rat" : 29,
    "garen" : 86,
    "blitzcrank" : 53, "blitz" : 53,
    "masteryi" : 11, "yi" : 11,
    "elise" : 60,
    "alistar" : 12, "ali" : 12, "cow" : 12,
    "katarina" : 55, "kat" : 55, "kata" : 55,
    "ekko" : 245,
    "mordekaiser" : 82, "mord" : 82, "morde" : 82,
    "lulu" : 117,
    "camille" : 164, "aatrox" : 266, "draven" : 119, "tahmkench" : 223,
    "pantheon" : 80, "panth" : 80,
    "xinzhao" : 5, "xin" : 5,
    "aurelionsol" : 136, "asol" : 136,
    "leesin" : 64, "lee" : 64, "ls" : 64,
    "taric" : 44,
    "malzahar" : 90, "malz" : 90,
    "kaisa" : 145, "diana" : 131,
    "tristana" : 18, "trist" : 18,
    "reksai" : 421, "vladimir" : 8, "vlad" : 8,
    "jarvaniv" : 59, "jarvan4" : 59, "j4" : 59,
    "nami" : 267, "jhin" : 202,
    "soraka" : 16, "raka" : 16,
    "veigar" : 45, "janna" : 40,
    "nautilus" : 111, "naut" : 111,
    "evelynn" : 28, "eve" : 28,
    "gragas" : 79, "zed" : 238, "ripadc" : 238,
    "vi" : 254, "kogmaw" : 96, "ahri" : 103, "quinn" : 133,
    "leblanc" : 7, "lb" : 7,
    "ezreal" : 81, "ez" : 81,
    "pyke" : 555
};

// inverse of champIDs
module.exports.champNames = {
    62: "Wukong", 24 : "Jax", 9 : "Fiddlesticks", 35 : "Shaco", 19 : "Warwick",
    498 : "Xayah", 76 : "Nidalee", 143 : "Zyra", 240 : "Kled", 63 : "Brand",
    33 : "Rammus", 420 : "Illaoi", 42 : "Corki", 201 : "Braum", 122 : "Darius",
    23 : "Tryndamere", 21 : "Miss Fortune", 83 : "Yorick", 101 : "Xerath",
    15 : "Sivir", 92 : "Riven", 61 : "Orianna", 41 : "Gangplank", 54 : "Malphite",
    78 : "Poppy", 127 : "Lissandra", 126 : "Jayce", 20 : "Nunu", 48 : "Trundle",
    30 : "Karthus", 104 : "Graves", 142 : "Zoe", 150 : "Gnar", 99 : "Lux",
    102 : "Shyvana", 58 : "Renekton", 114 : "Fiora", 222 : "Jinx", 429 : "Kalista",
    105 : "Fizz", 38 : "Kassadin", 37 : "Sona", 39 : "Irelia", 112 : "Viktor",
    497 : "Rakan", 203 : "Kindred", 69 : "Cassiopeia", 57 : "Maokai", 516 : "Ornn",
    412 : "Thresh", 10 : "Kayle", 120 : "Hecarim", 121 : "Khazix", 2 : "Olaf",
    115 : "Ziggs", 134 : "Syndra", 36 : "Dr. Mundo", 43 : "Karma", 1 : "Annie",
    84 : "Akali", 106 : "Volibear", 157 : "Yasuo", 85 : "Kennen", 107 : "Rengar",
    13 : "Ryze", 98 : "Shen", 154 : "Zac", 91 : "Talon", 50 : "Swain", 432 : "Bard",
    14 : "Sion", 67 : "Vayne", 75 : "Nasus", 141 : "Kayne", 4 : "Twisted Fate",
    31 : "Cho'Gath", 77 : "Udyr", 236 : "Lucian", 427 : "Ivern", 89 : "Leona",
    51 : "Caitlyn", 113 : "Sejuani", 56 : "Nocturne", 26 : "Zilean", 268 : "Azir",
    68 : "Rumble", 25 : "Morgana", 163 : "Taliyah", 17 : "Teemo", 6 : "Urgot",
    32 : "Amumu", 3 : "Galio", 74 : "HeimerDinger", 34 : "Anivia", 22 : "Ashe",
    161 : "Vel'Koz", 27 : "Singed", 72 : "Skarner", 110 : "Varus", 29 : "Twitch",
    86 : "Garen", 53 : "Blitzcrank", 11 : "Master Yi", 60 : "Elise", 12 : "Alistar",
    55 : "Katarina", 245 : "Ekko", 82 : "Mordekaiser", 117 : "Lulu", 164 : "Camille",
    266 : "Aatrox", 119 : "Draven", 223 : "Tham Kench", 80 : "Pantheon", 5 : "Xin Zhao",
    136 : "Aurellion Sol", 64 : "Lee Sin", 44 : "Taric", 90 : "Malzahar", 145 : "Kaisa",
    131 : "Diana", 18 : "Tristana", 421 : "Rek'Sai", 8 : "Vladimir", 59 : "Jarvan IV",
    267 : "Nami", 202 : "Jhin", 16 : "Soraka", 45 : "Veigar", 40 : "Janna",
    111 : "Nautilus", 28 : "Evelynn", 79 : "Gragas", 238 : "Zed", 254 : "Vi",
    96 : "Kog'Maw", 103 : "Ahri", 133 : "Quinn", 7 : "LeBlanc", 81 : "Ezreal",
    555 : "Pyke"
};
/*
module.exports.champNames = {};
for (key in module.exports.champIDs)
    module.exports.champNames[module.exports.champIDs[key]] = key;
*/
// both sides of the dict
module.exports.champs = Object.assign({}, module.exports.champIDs, module.exports.champNames);
