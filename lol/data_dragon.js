const teemo = require("./teemo");

// runes reforged
module.exports.safePatch = "7.23.1";
module.exports.currPatch = module.exports.safePatch;
module.exports.url;

// patch data: https://ddragon.leagueoflegends.com/cdn/9.9.1/img/champion/Nunu.png
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
module.exports.champName = (id) => {

    let ret = teemo.champNames[id]
        .replace(/[\s\.\']/g, "") // no spaces, apostrphes, or periods
        .replace(/\&.+/, ""); // specifically for nunu

    if (["ChoGath", "LeBlanc", "KhaZix", "VelKoz"].includes(ret))
        ret = ret.charAt(0).toUpperCase() + ret.slice(1).toLowerCase();
    if (ret == "Wukong")
        return "MonkeyKing";
    if (ret == "Nunu&Willump")
        return "Nunu";

    return ret;
}



function refresh(){
    getUrl();
    setTimeout(refresh, 3600000);
}
refresh();
