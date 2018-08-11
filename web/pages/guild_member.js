
const express = require("express");

const router = express.Router();

const bot = require("../middleman");


router.get("/member", bot.catchAsync(async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login/");
        return;
    }


    const userid = await bot.getUserID(req.cookies.token, res);
    const perms = mods.getModData(req.params.serverid, userid);

    // list servers

    console.log(req);


}));

module.exports = router;
