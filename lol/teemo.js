const fs = require("fs");
const Teemo = require("teemojs");



// riot api
const riotAPIToken = `${fs.readFileSync(`${process.env.HOME}/.corki/riot_key`)}`.trim();
module.exports.riot = new Teemo(riotAPIToken);

// champgg api
const champGGToken = `${fs.readFileSync(`${process.env.HOME}/.corki/champgg_key`)}`.trim();
module.exports.champgg = new Teemo(champGGToken, Teemo.championGGConfig);


// server names for teemo
module.exports.serverNames = {
    "br"  : "br1", "eune" : "eun1", "euw" : "euw1",
    "jp"  : "jp1", "kr"  : "kr",   "lan" : "la1",
    "las" : "la2",  "na" : "na1",  "oce" : "oc1",
    "tr"  : "tr1", "ru"  : "ru",  "pbe" : "pbe1"
};
module.exports.champNames = {};

// also include inverted keys/values
for (key in module.exports.serverNames)
    module.exports.serverNames[module.exports.serverNames[key]] = key;



// edit when new champs come out
module.exports.champIDs = {

    "aatrox" : 266, "azir" : 268, "akali" : 84,
    "annie" : 1, "tibbers" : 1,
    "anivia" : 34, "egg" : 34, "aniv" : 34,
    "alistar" : 12, "ali" : 12, "cow" : 12,
    "amumu" : 32, "mumu" : 32,
    "ahri" : 103, "ashe" : 22,
    "aurelionsol" : 136, "asol" : 136,

    "brand" : 63,
    "bard" : 432, "meep" : 432,
    "braum" : 201,
    "blitzcrank" : 53, "blitz" : 53, "bc" : 52,

    "corgi" : 42 , "corki" : 42,
    "cassiopeia" : 69, "cass" : 69,
    "chogath" : 31, "cho" : 31, "cho'gath" : 31,
    "caitlyn" : 51, "cait" : 51,
    "camille" : 164,

    "darius" : 122, "dunk" : 122, "dar" : 122,
    "drmundo" : 36, "mundo" : 36, "dr.mundo" : 36,
    "draven" : 119, "t1" : 119,
    "diana" : 131,

    "elise" : 60, "spider" : 60,
    "ekko" : 245,
    "evelynn" : 28, "eve" : 28,
    "ezreal" : 81, "ez" : 81,


    "fiddlesticks" : 9, "fidd" : 9, "fid" : 9, "fiddle" : 9,
    "fiora" : 114, "fizz" : 105, "fish" : 105,

    "gangplank" : 41, "pirate" : 41, "gp" : 41,
    "galio" : 3, "garen" : 86, "gnar" : 150, "gragas" : 79,
    "graves" : 104, "cigar" : 104,

    "heimerdinger" : 74, "heim" : 74, "donger" : 74, "dinger" : 74,
    "hecarim" : 120, "hec" : 120, "pony" : 120, "horse" : 120,

    "ivern" : 427, "irelia" : 39, "illaoi" : 420,

    "jarvaniv" : 59, "jarvan4" : 59, "j4" : 59,
    "janna" : 40, "jhin" : 202,"jax" : 24, "jayce" : 126, "jinx" : 222,

    "karthus" : 30, "karth" : 30,
    "kaisa" : 145, "kai'sa" : 145, "kindred" : 203,
    "kled" : 240, "kalista" : 429, "karma" : 43, "kayn" : 141, "kennen" : 85,
    "kassadin" : 38, "kass" : 38,
    "khazix" : 121, "bug" : 121, "zix" : 121, "k6" : 121, "kha" : 121, "kha'zix" : 121,
    "katarina" : 55, "kat" : 55, "kata" : 55,
    "kogmaw" : 96, "kog" : 96, "kog'maw" : 96,

    "leblanc" : 7, "lb" : 7,
    "leesin" : 64, "lee" : 64, "ls" : 64,
    "lulu" : 117, "lux" : 99,
    "lucian" : 236, "luc" : 236,
    "leona" : 89,
    "lissandra" : 127, "liss" : 127,

    "malzahar" : 90, "malz" : 90,
    "masteryi" : 11, "yi" : 11,
    "maokai" : 57, "mao" : 57,
    "morgana" : 25, "morg" : 25,
    "malphite" : 54, "rock" : 54, "malph" : 54,
    "missfortune" : 21, "mf" : 21, "miss" : 21, "miss fortune" : 21,
    "mordekaiser" : 82, "mord" : 82, "morde" : 82,

    "nocturne" : 56, "noc" : 56,
    "nasus" : 75, "susan" : 75,
    "nami" : 267,
    "nautilus" : 111, "naut" : 111,
    "neeko" : 518, "neko" : 518,
    "nidalee" : 76, "nid" : 76,
    "nunu" : 20, "yeti" : 20, "nunu&willump" : 20, "nunuandwillump" : 20,
    "willump" : 20, "nunuwillump" : 20,

    "orianna" : 61, "ori" : 61,
    "ornn" : 516, "orn" : 516, "thresh" : 412, "kayle" : 10,
    "olaf" : 2, "ziggs" : 115, "syndra" : 134,

    "pantheon" : 80, "panth" : 80,
    "poppy" : 78,
    "pyke" : 555, "ks" : 555,

    "quinn" : 133,

    "rakan" : 497, "rammus" : 33,
    "renekton" : 58, "renek" : 58, "croc" : 58,
    "riven" : 92, "reksai" : 421, "rumble" : 68, "rengar" : 107, "ryze" : 13,

    "shaco" : 35, "clown" : 35,
    "shyvana" : 102, "shyv" : 102,
    "sona" : 37, "swain" : 50, "sion" : 14, "shen" : 98,
    "sivir" : 15, "singed" : 27, "skarner" : 72,
    "sejuani" : 113, "sej" : 113,
    "soraka" : 16, "raka" : 16,
    "sylas" : 517,

    "talon" : 91, "taliyah" : 163,
    "tahmkench" : 223, "taric" : 44,
    "teemo" : 17, "satan" : 17, "beemo" : 17, "tenmo" : 17,
    "tristana" : 18, "trist" : 18,
    "trundle" : 48, "troll" : 48,
    "tryndamere" : 23, "trynd" : 23,
    "twistedfate" : 4, "tf" : 4,
    "twitch" : 29, "rat" : 29,

    "udyr" : 77,"urgot" : 6,

    "vayne" : 67,
    "veigar" : 45,
    "vi" : 254,
    "viktor" : 112,
    "volibear" : 106, "voli" : 106,
    "vladimir" : 8, "vlad" : 8,
    "velkoz" : 161, "varus" : 110,

    "wukong" : 62, "monkey" : 62, "wk" : 62, "monkeyking" : 62, "mk" : 62,
    "warwick" : 19, "ww" : 19,

    "xinzhao" : 5, "xin" : 5,
    "xayah" : 498, "xerath" : 101,

    "yorick" : 83,
    "yasuo" : 157, "yas" : 157, "trashuo" : 157,

    "zyra" : 143, "plants" : 143,
    "zac" : 154,
    "zed" : 238, "ripadc" : 238,
    "zoe" : 142,
    "zilean" : 26, "zil" : 26,

};

// inverse of champIDs
module.exports.champNames = {
    62: "Wukong", 24 : "Jax", 9 : "Fiddlesticks", 35 : "Shaco", 19 : "Warwick",
    498 : "Xayah", 76 : "Nidalee", 143 : "Zyra", 240 : "Kled", 63 : "Brand",
    33 : "Rammus", 420 : "Illaoi", 42 : "Corki", 201 : "Braum", 122 : "Darius",
    23 : "Tryndamere", 21 : "Miss Fortune", 83 : "Yorick", 101 : "Xerath",
    15 : "Sivir", 92 : "Riven", 61 : "Orianna", 41 : "Gangplank", 54 : "Malphite",
    78 : "Poppy", 127 : "Lissandra", 126 : "Jayce", 20 : "Nunu & Willump", 48 : "Trundle",
    30 : "Karthus", 104 : "Graves", 142 : "Zoe", 150 : "Gnar", 99 : "Lux",
    102 : "Shyvana", 58 : "Renekton", 114 : "Fiora", 222 : "Jinx", 429 : "Kalista",
    105 : "Fizz", 38 : "Kassadin", 37 : "Sona", 39 : "Irelia", 112 : "Viktor",
    497 : "Rakan", 203 : "Kindred", 69 : "Cassiopeia", 57 : "Maokai", 516 : "Ornn",
    412 : "Thresh", 10 : "Kayle", 120 : "Hecarim", 121 : "Kha'Zix", 2 : "Olaf",
    115 : "Ziggs", 134 : "Syndra", 36 : "Dr. Mundo", 43 : "Karma", 1 : "Annie",
    84 : "Akali", 106 : "Volibear", 157 : "Yasuo", 85 : "Kennen", 107 : "Rengar",
    13 : "Ryze", 98 : "Shen", 154 : "Zac", 91 : "Talon", 50 : "Swain", 432 : "Bard",
    14 : "Sion", 67 : "Vayne", 75 : "Nasus", 141 : "Kayne", 4 : "Twisted Fate",
    31 : "Cho'Gath", 77 : "Udyr", 236 : "Lucian", 427 : "Ivern", 89 : "Leona",
    51 : "Caitlyn", 113 : "Sejuani", 56 : "Nocturne", 26 : "Zilean", 268 : "Azir",
    68 : "Rumble", 25 : "Morgana", 163 : "Taliyah", 17 : "Teemo", 6 : "Urgot",
    32 : "Amumu", 3 : "Galio", 74 : "Heimerdinger", 34 : "Anivia", 22 : "Ashe",
    161 : "Vel'Koz", 27 : "Singed", 72 : "Skarner", 110 : "Varus", 29 : "Twitch",
    86 : "Garen", 53 : "Blitzcrank", 11 : "Master Yi", 60 : "Elise", 12 : "Alistar",
    55 : "Katarina", 245 : "Ekko", 82 : "Mordekaiser", 117 : "Lulu", 164 : "Camille",
    266 : "Aatrox", 119 : "Draven", 223 : "Tham Kench", 80 : "Pantheon", 5 : "Xin Zhao",
    136 : "Aurellion Sol", 64 : "Lee Sin", 44 : "Taric", 90 : "Malzahar", 145 : "Kaisa",
    131 : "Diana", 18 : "Tristana", 421 : "Rek'Sai", 8 : "Vladimir", 59 : "Jarvan IV",
    267 : "Nami", 202 : "Jhin", 16 : "Soraka", 45 : "Veigar", 40 : "Janna",
    111 : "Nautilus", 28 : "Evelynn", 79 : "Gragas", 238 : "Zed", 254 : "Vi",
    96 : "Kog'Maw", 103 : "Ahri", 133 : "Quinn", 7 : "LeBlanc", 81 : "Ezreal",
    555 : "Pyke", 518 : "Neeko", 517 : "Sylas"
};

/*
module.exports.champNames = {};
for (key in module.exports.champIDs)
    module.exports.champNames[module.exports.champIDs[key]] = key;
*/
// both sides of the dict
module.exports.champs = Object.assign({}, module.exports.champIDs, module.exports.champNames);

module.exports.ddragon = require("./data_dragon");
