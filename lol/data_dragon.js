const fetch = require("node-fetch");

module.exports.safePatch = "7.23.1";
module.exports.currPatch = module.exports.safePatch;


async function getUrl(){
    return new Promise(function(resolve, reject) {
        fetch("https://ddragon.leagueoflegends.com/realms/na.json").then(resp => {

            module.exports.currPatch = resp.item;
            resolve(resp.cdn + resp.item);
        }).catch(reject);
    });
}

getUrl().then(url => module.exports.ddragonurl = url);

function refresh(){
    getUrl();
    setTimeout(refresh, 3600000);
}
