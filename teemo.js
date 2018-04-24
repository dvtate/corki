const fs = require("fs");


const Teemo = require("teemojs");
const riotAPIToken = `${fs.readFileSync(`${process.env.HOME}/.corki/riot_key`)}`.trim();

module.exports.riot = new Teemo(riotAPIToken);

const champGGToken = fs.readFileSync(`${process.env.HOME}/.corki/champgg_key`);


module.exports.champgg = new Teemo(champGGToken, {
  "prefix": "http://api.champion.gg",
  "retries": 3,
  "maxConcurrent": 2000,
  "distFactor": 1,
  "defaultBuckets": [{
    "timespan": 600000,
    "limit": 3000
  }, {
    "timespan": 10000,
    "limit": 50
  }],
  "rateLimitTypeApplication": {
    "name": "application",
    "headerLimit": null,
    "headerCount": "x-rate-limit"
  },
  "rateLimitTypeMethod": null,
  "defaultRetryAfter": 10,
  "headerRetryAfter": "retry-after",
  "headerLimitType": null,
  "defaultLimitType": "application",
  "keyHeader": null,
  "keyQueryParam": "api_key",
  "collapseQueryArrays": true,
  "endpoints": {
    "champion": {
      "getAllChampions": "/v2/champions",
      "getChampionMatchupsByRole": "/v2/champions/%s/%s/matchups",
      "getChampionMatchups": "/v2/champions/%s/matchups",
      "getChampion": "/v2/champions/%s"
    },
    "general": "/v2/general",
    "overall": "/v2/overall"
  }
});



module.exports.serverNames = {
    "br"  : "br1", "eune": "eun1", "euw" : "euw1",
    "jp"  : "jp1", "kr"  : "kr",   "lan" : "la1",
    "las" : "la2",  "na" : "na1",  "oce" : "oc1",
    "tr"  : "tr1", "ru"  : "ru1",  "pbe" : "pbe1"
}

module.exports.champIDs = {
	"Wukong" : 62, "Jax": 24, "Fiddlesticks": 9, "Shaco": 35, "Warwick": 19,
    "Xayah": 498, "Nidalee": 76, "Zyra": 143, "Kled": 240, "Brand": 63, "Rammus": 33,
    "Illaoi": 420, "Corki": 42, "Braum": 201, "Darius": 122, "Tryndamere": 23,
    "MissFortune": 21, "Yorick": 83, "Xerath": 101, "Sivir": 15, "Riven": 92,
    "Orianna": 61, "Gangplank": 41, "Malphite": 54, "Poppy": 78, "Lissandra": 127,
    "Jayce": 126, "Nunu": 20, "Trundle": 48, "Karthus": 30, "Graves": 104,
    "Zoe": 142, "Gnar": 150, "Lux": 99, "Shyvana": 102, "Renekton": 58, "Fiora": 114,
    "Jinx": 222, "Kalista": 429, "Fizz": 105, "Kassadin": 38, "Sona": 37, "Irelia": 39,
    "Viktor": 112, "Rakan": 497, "Kindred": 203, "Cassiopeia": 69, "Maokai": 57,
    "Ornn": 516, "Thresh": 412, "Kayle": 10, "Hecarim": 120, "Khazix": 121,
    "Olaf": 2, "Ziggs": 115, "Syndra": 134, "DrMundo": 36, "Karma": 43, "Annie": 1,
    "Akali": 84, "Volibear": 106, "Yasuo": 157, "Kennen": 85, "Rengar": 107,
    "Ryze": 13, "Shen": 98, "Zac": 154, "Talon": 91, "Swain": 50, "Bard": 432,
    "Sion": 14, "Vayne": 67, "Nasus": 75, "Kayn": 141, "TwistedFate": 4, "Chogath": 31,
    "Udyr": 77, "Lucian": 236, "Ivern": 427, "Leona": 89, "Caitlyn": 51, "Sejuani": 113,
    "Nocturne": 56, "Zilean": 26, "Azir": 268, "Rumble": 68, "Morgana": 25,
    "Taliyah": 163, "Teemo": 17, "Urgot": 6, "Amumu": 32, "Galio": 3, "Heimerdinger": 74,
    "Anivia": 34, "Ashe": 22, "Velkoz": 161, "Singed": 27, "Skarner": 72, "Varus": 110,
    "Twitch": 29, "Garen": 86, "Blitzcrank": 53, "MasterYi": 11, "Elise": 60,
    "Alistar": 12, "Katarina": 55, "Ekko": 245, "Mordekaiser": 82, "Lulu": 117,
    "Camille": 164, "Aatrox": 266, "Draven": 119, "TahmKench": 223, "Pantheon": 80,
    "XinZhao": 5, "AurelionSol": 136, "LeeSin": 64, "Taric": 44, "Malzahar": 90,
    "Kaisa": 145, "Diana": 131, "Tristana": 18, "RekSai": 421, "Vladimir": 8,
    "JarvanIV": 59, "Nami": 267, "Jhin": 202, "Soraka": 16, "Veigar": 45,
    "Janna": 40, "Nautilus": 111, "Evelynn": 28, "Gragas": 79, "Zed": 238,
    "Vi": 254, "KogMaw": 96, "Ahri": 103, "Quinn": 133, "Leblanc": 7, "Ezreal": 81
};
