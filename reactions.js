/// Particularly useful, but adds character

module.exports = [
    { //
        condition: msg =>
            msg.content.match(/corki is (?:so |a(?: little)? |very |kinda |pretty |such a |quite(?: a)? )?(?:weak|underpowered|useless|bad|pointless|lame|trash|(?:dog)?shit(?:ty)?|stupid)/i),
        act: async msg => msg.react("❓")
    },
    { // no friends feelbadman
        condition: msg =>
            msg.content.match(/I (?:feel like |think |recognize |\'ve recognized (?:that)?\s?i? |really(?: do)? )?have no friends|^I (?:don['`]?t have|haven['`]?t got) any friends/i),
        act: async function (msg) {
            msg.channel.send(`${global.client.user}${require("lunicode-tiny").encode(",,, but I'm your friend!!!")}`);
        }
    }
];
