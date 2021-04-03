const cfg = require("./cfg");
const teemo = require("../lol/teemo");

/*
    configure preset role configurations:
    - create associated roles
    - write config file using roles and correct conditions
    - profit
*/
/// options: {announce:{}, max_rank:1/0, queue:ranked queue }
async function lol_rank_roles(giuldId, options) {
    const guild = await global.client.guilds.fetch(guildId);

    const ranks = [ "Iron", "Bronze", "Silver", "Gold", "Platinum", "Diamond",
                    "Master", "Grandmaster", "Challenger" ];
    const rids = [ 'i', 'b', 's', 'g', 'p', 'd', 'm', 'gm', 'c' ];

    const q = options.queue || "any";

    let roles = {};
    try {
        for (let i = 0; i < ranks.length; i++)
            roles[ranks[i]] = await guild.roles.create({
                data: { name: ranks[i], color: "DEFAULT" },
                reason: 'lol rank roles preset',
            });

    } catch (e) {
        console.error(e);
        throw e;
    }
    let config = {};
    for (let i = 0; i < ranks.length; i++) {
        let role = {};
        role.role = {
            name: roles[ranks[i]].name;
            id: roles[ranks[i]].id;
        };
        role.cond = `"${rids[i]}" "${q}" ${options.max_rank ? "lol_queue_max_rank" : "lol_queue_has_rank" }`;
        if (options.announce)
            role.announce = options.announce;

        config.push(role);
    }
    cfg.set(guildId, config);
}
module.exports.lol_rank_roles = lol_rank_roles;



async function lol_mastery_level_roles(guildId, options) {

}
module.exports.lol_mastery_level_roles = lol_mastery_level_roles;


async function lol_mastery_point_roles(guildId, options) {

}
module.exports.lol_mastery_point_roles = lol_mastery_point_roles;
