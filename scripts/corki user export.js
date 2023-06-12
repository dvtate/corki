const fs = require('fs');
const Teemo = require('teemojs');
const teemo = new Teemo(`${fs.readFileSync(`${process.env.HOME}/.corki/riot_key`)}`.trim());

const lolAcctsToGet = [];

fs.readdirSync(`${process.env.HOME}/.corki/users`).forEach(discUid => {
    let json;    
    try {
        json = fs.readFileSync(`${process.env.HOME}/.corki/users/${discUid}/lol.json`).toString();
    } catch(e) {
        console.error('no lol.json for user id ' + discUid );
        return;
    }
    let o;
    try {
        o = JSON.parse(json);
    } catch (e) {
        console.error('invalid json for user id ' + discUid + ': "' + json + '"');
        process.exit(1);
    }
    o.accounts.forEach(a => { a.discordUserId = discUid; });
    lolAcctsToGet.push(...o.accounts);
});

const regions = ['BR1','EUN1','EUW1','JP1','KR','LA1','LA2','OC1','PH2','RU','SG2','TH2','TR1','TW2','VN2'];

console.log('fetching data for %d lol accounts', lolAcctsToGet.length,'...');
Promise.all(lolAcctsToGet.map(async a => {
    const r = await teemo.get(a.server, 'summoner.getByPUUID', a.puuid);
    const rn = await teemo.get(a.server, 'summoner.getBySummonerName', r.name);
    if (rn.puuid === r.puuid)
        return [a.discordUserId, a.server, r.name];
    console.log('region change');

    // They changed regions
    for (const s of regions) {
        if (s == a.server)
            continue;
        const rn = await teemo.get(s, 'summoner.getBySummonerName', r.name);
        if (rn.puuid === r.puuid)
            return [a.discordUserId, s, r.name]; 
    }
    console.log("couldn't find account:", a);
    return null; // account must be deleted or sth...
})).then(l => {
    l = l.filter(Boolean);
    console.log(l);
    fs.writeFileSync('lol_accounts_list.json', JSON.stringify(l));
});
