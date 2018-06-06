/// Particularly useful, but adds character

module.exports = [
    { //
        condition: function (msg) {
            return msg.content.match(/corki is (?:so |a(?: little)? |very |kinda |pretty |such a |quite(?: a)? )?(?:weak|underpowered|useless|bad|pointless|lame|trash|(?:dog)?shit(?:ty)?|stupid)/i);
        },
        act: async function (msg) {
            msg.react("❓");
        }
    },

    { // no friends feelbadman
        condition: function (msg) {
            return msg.content.match(/^I (?:feel like |think |recognize |\'ve recognized (?:that)?\s?i? |really(?: do)? )?have no friends|^I (?:don['`]?t have|haven['`]?t got) any friends/i);
        },
        act: async function (msg) {
            console.log("feels bad");
            msg.channel.send("-tinycaps but i'm your friend!");
        }
    }

];
