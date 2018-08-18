const fetch = require("node-fetch");

module.exports.safePatch = "7.23.1";
module.exports.currPatch = module.exports.safePatch;


async function getUrl(){
    return new Promise(function(resolve, reject) {
        fetch("https://ddragon.leagueoflegends.com/realms/na.json").then(data => {
            data.json().then(resp => {
                module.exports.currPatch = resp.v;
                module.exports.url = resp.cdn + '/' + resp.dd;
                resolve(module.exports.url);
            });
        }).catch(reject);
    });
}

function refresh(){
    getUrl();
    setTimeout(refresh, 3600000);
}
refresh();
