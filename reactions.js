/// Particularly useful, but adds character

module.exports = [
    { //
        condition: function (msg) {
            console.log("f");
            return msg.content.match(/corki is (?:so|a(?: little)?|very|kinda|pretty|such a|quite(?: a)?)? (?:weak|underpowered|useless|pointless|lame|trash|(?:dog)?shit(?:ty)?|stupid)/i);
        },
        act: async function (msg) {
            msg.react("❓");
        }
    },

    { // no friends feelbadman
        condition: function (msg) {
            console.log("g");
            msg.content.match(/^I (?:feel like |think |recognize |\'ve recognized (?:that)?\s?i? |really(?: do)? )?have no friends|^I don['`]?t have any friends/i);
        },
        act: async function (msg) {
            console.log("feels bad");
            msg.channel.send("-tinycaps but i'm your friend!");
        }
    }

];
