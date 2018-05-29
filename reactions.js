


module.exports = [
    {
        condition: function (msg) {
            return msg.content.match(/corki is (?:so|a(?: little)?|very|kinda|pretty|such a|quite(?: a)?)? (?:weak|underpowered|useless|pointless|lame|trash|(?:dog)shit(?:ty)?|stupid)/);
        },
        act: async function (msg) {
            msg.react("❓");
        }
    },



]
