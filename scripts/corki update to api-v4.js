

const fs = require("fs");
const Teemo = require("teemojs");


// riot api
const riotAPIToken = fs.readFileSync(`${process.env.HOME}/.corki/riot_key`).toString().trim();
const riot = new Teemo(riotAPIToken, {
  "prefix": "https://%s.api.riotgames.com",
  "retries": 3,
  "maxConcurrent": 2000,
  "distFactor": 1,
  "defaultBuckets": [
    {
      "timespan": 1000,
      "limit": 1,
      "factor": 1,
      "spread": 0
    }
  ],
  "rateLimitTypeApplication": {
    "name": "application",
    "headerLimit": "x-app-rate-limit",
    "headerCount": "x-app-rate-limit-count"
  },
  "rateLimitTypeMethod": {
    "name": "method",
    "headerLimit": "x-method-rate-limit",
    "headerCount": "x-method-rate-limit-count"
  },
  "defaultRetryAfter": null,
  "headerRetryAfter": "retry-after",
  "headerLimitType": "x-rate-limit-type",
  "defaultLimitType": null,
  "keyHeader": "X-Riot-Token",
  "keyQueryParam": null,
  "collapseQueryArrays": false,
  "endpoints": {
    "championMastery": {
      "getAllChampionMasteries": "/lol/champion-mastery/v3/champion-masteries/by-summoner/%s",
      "getChampionMastery": "/lol/champion-mastery/v3/champion-masteries/by-summoner/%s/by-champion/%s",
      "getChampionMasteryScore": "/lol/champion-mastery/v3/scores/by-summoner/%s"
    },
    "champion": {
      "getChampionInfo": "/lol/platform/v3/champion-rotations"
    },
    "league": {
      "getChallengerLeague": "/lol/league/v3/challengerleagues/by-queue/%s",
      "getGrandmasterLeague": "/lol/league/v3/grandmasterleagues/by-queue/%s",
      "getLeagueById": "/lol/league/v3/leagues/%s",
      "getMasterLeague": "/lol/league/v3/masterleagues/by-queue/%s",
      "getAllLeaguePositionsForSummoner": "/lol/league/v3/positions/by-summoner/%s"
    },
    "lolStatus": {
      "getShardData": "/lol/status/v3/shard-data"
    },
    "match": {
      "getMatchIdsByTournamentCode": "/lol/match/v3/matches/by-tournament-code/%s/ids",
      "getMatch": "/lol/match/v3/matches/%s",
      "getMatchByTournamentCode": "/lol/match/v3/matches/%s/by-tournament-code/%s",
      "getMatchlist": "/lol/match/v3/matchlists/by-account/%s",
      "getMatchTimeline": "/lol/match/v3/timelines/by-match/%s"
    },
    "spectator": {
      "getCurrentGameInfoBySummoner": "/lol/spectator/v3/active-games/by-summoner/%s",
      "getFeaturedGames": "/lol/spectator/v3/featured-games"
    },
    "summoner": {
      "getByAccountId": "/lol/summoner/v3/summoners/by-account/%s",
      "getBySummonerName": "/lol/summoner/v3/summoners/by-name/%s",
      "getBySummonerId": "/lol/summoner/v3/summoners/%s"
    },
    "thirdPartyCode": {
      "getThirdPartyCodeBySummonerId": "/lol/platform/v3/third-party-code/by-summoner/%s"
    }
  }
});

const v4 = new Teemo(riotAPIToken);



function setUserData(id, usrObj) {
    fs.writeFileSync(`${process.env.HOME}/.corki/users/${id}/lol.json`, JSON.stringify(usrObj));
}

function getUserData (id) {
    if (!fs.existsSync(`${process.env.HOME}/.corki/users/${id}/lol.json`))
        return null;

    return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/users/${id}/lol.json`));
}

async function refreshUserData(id) {
    let data = getUserData(id);
    if (!data || !data.accounts) return;

    // array of promises of account objects
    let rep_req = data.accounts.map(a =>
        (new Promise(async (resolve, reject) => {
            const summ = await riot.get(a.server, "summoner.getBySummonerId", a.id);
            resolve(summ ? { // new user obj
                name: summ.name, server: a.server,
                id: summ.id, accountId: summ.accountId,
                puuid: summ.puuid
            } : null);
        })).catch(e => null)
    );

    let new_accts = await Promise.all(rep_req);
    for (let i = 0; i < data.accounts.length; i++)
        if (new_accts[i])
            data.accounts[i] = new_accts[i];

    setUserData(id, data);

}

async function updateUserData(id) {
    let data = getUserData(id);
    if (!data || !data.accounts) return;

	let rep_req = data.accounts.map(a => 
		(new Promise(async(resolve, reject) => {
			const summ = await v4.get(a.server, "summoner.getBySummonerName", a.name);
			resolve(summ ? {
                name: summ.name, server: a.server,
                id: summ.id, accountId: summ.accountId,
                puuid: summ.puuid
			} : null);

		})).catch(e => null)
	);

    let new_accts = await Promise.all(rep_req);
    for (let i = 0; i < data.accounts.length; i++)
        if (new_accts[i])
            data.accounts[i] = new_accts[i];

    setUserData(id, data);

}


	
const hasAccts  = id => fs.existsSync(`${process.env.HOME}/.corki/users/${id}/lol.json`);
const usersList = fs.readdirSync(`${process.env.HOME}/.corki/users`).filter(hasAccts);


//usersList.forEach(refreshUserData);
usersList.forEach(updateUserData);