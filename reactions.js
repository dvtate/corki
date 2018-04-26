


module.exports = [
    {
        condition: function (msg) {
            return msg.content.match(/corki is (?:so|a|a little|very|kinda|pretty)? (?:weak|underpowered|useless|pointless|lame|trash|shit(?:ty)?|stupid)/);
        },
        act: async function (msg) {
            msg.react("❓");
        }
    },

    

]
