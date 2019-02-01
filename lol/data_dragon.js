const fetch = require("node-fetch");
const teemo = require("./teemo");

// runes reforged
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
        }).catch(e => {
            console.error("ddragon url err");
            console.error(e);
            reject(e);
        });
    });
}


// datadragon expects champnames in this format kinda weird but eh
module.exports.champName = (id) =>
    teemo.champNames[id]
      .replace(' ', "") // no spaces
      .replace('\'', "") // no apostrphes
      .replace(/\&.+/, ""); // specifically for nunu


function refresh(){
    getUrl();
    setTimeout(refresh, 3600000);
}
refresh();
