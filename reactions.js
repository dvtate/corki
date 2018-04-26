


module.exports = [
    {
        condition: function (msg) {
            return msg.content.match(/corki is (?:so|very|kinda)? (?:weak|underpowered|lame|trash|shit(?:ty)?)/);
        },
        act: async function (msg) {
            msg.react("❓");
        }
    }
]
