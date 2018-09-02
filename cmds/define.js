const fs = require("fs");


const logCmd = require("../logging.js");
const request = require("request");
const sam = require("../sam/sam");
const mods = require("../sam/mods");

function getDefinitions(guildid) {
    try {
        return JSON.parse(fs.readFileSync(`${process.env.HOME}/.corki/servers/${guildid}/dict.json`));
    } catch (e) {
        // no definitons
        return {};
    }
}

function setDefinitions(guildid, defs) {
    sam.makeServerDir(guildid);
    fs.writeFileSync(`${process.env.HOME}/.corki/servers/${guildid}/dict.json`, JSON.stringify(defs));
}

module.exports = [
    {
        condition: msg => msg.content.match(/^define (.+)$/),
        act: async function (msg) {
            logCmd(msg, "used dictionary");

            if (!msg.guild)
                return msg.channel.send(`This command is only available for servers.`);


            const term = this.condition(msg)[1].trim();
            const def = getDefinitions(msg.guild.id)[term];

            if (!def) {
                msg.channel.send({ embed: {
                    title: "Term Not Found",
                    description: "It appears this term hasn't been defined in this server.",
                }});
                msg.channel.send(defineHelp);
                return;
            }

            // rules for fields
            //   - fields separated by -=======-
            //   - titles for fields can be set via a :title imediatly after

            const fields = def.split(/\n-=+-\n/).map(v => v.trim());

            //msg.channel.send(`**${term}:**\n${def}`);
            msg.channel.send({ embed: {
                title: `**${term}:**`,
                description: `${fields[0]}`,

                fields: fields.slice(1).map((e, i) => {
                    let title = e.match(/^\:(.+)/);
                    const desc = title ? e.match(/^\:(.+)([\S\s]+)/)[2] : e;
                    if (title) title = title[1];

                    return {
                        name: title || (i + 1).toString(),
                        value: desc
                    };
                }),

                footer: {
                    text: `Corki's Dictionary of ${msg.guild.name}`
                }
            }});
        }

    },

    {
        condition: msg => msg.content.match(/^define (.+)([\s\S]+)/),
        act: async function (msg) {

            logCmd(msg, "added definition");

            if (!msg.guild)
                return msg.channel.send(`This command is only available for servers.`);

            if (!mods.isMod(msg.guild.id, msg.author.id))
                return msg.channel.send("You are not authorized to use this command here. \
Ask the server Administrator to give you permissions via the web portal ( https://corki.js.org/portal )");

            const term = this.condition(msg)[1].trim();
            const def = this.condition(msg)[2].trim();

            let dict = getDefinitions(msg.guild.id);
            dict[term] = def;
            setDefinitions(msg.guild.id, dict);
            msg.channel.send("Appended to dictionary!");

        }
    },

    {
        condition: msg => msg.content.match(/^dictionary (?:terms|words|entries|definitions|defs)(?:$|\s)/),
        act: async msg => {
            logCmd(msg, "read dictionary");

            if (!msg.guild)
                return msg.channel.send(`This command is only available for servers.`);


            let terms = Object.keys(getDefinitions(msg.guild.id));

            if (!terms.length) {
                msg.channel.send("You have no defined terms");
                msg.channel.send(defineHelp);
                return;
            }

            msg.channel.send(`This server has ${terms.length} terms defined:\n${terms.join(", ")}`);

        }
    },

    {
        condition: msg => msg.content.match(/^help (?:define|dictionary)/),
        act: async msg => {
            msg.channel.send(`Associated commands:
- \`define <term>\`: send definition of given term
- \`define <term>
<definition>\`: [re]define a term (mods)
- \`dictionary terms\`: list all defined terms`);
            msg.channel.send(defineHelp);
        }
    }


];

module.exports.getDefinitions = getDefinitions;
module.exports.setDefinitions = setDefinitions;

const defineHelp = { embed: {
    title: "Defining a term",
    description: "Corki can help keep track of slang used in a given server, mods\
 can use define to set definitions so that users can use define when confused",
    fields: [
        {
            name: "Define a Term",
            value: `The following command template will help you to define a term:
\`\`\`
@Corki define <term>
<term entry>
\`\`\`
            `
        }, {
            name: "Subheadings:",
            value: `
To add subheadings separate text using \`-===-\`

If you would like to title your subheadings use
\`:<title>\` on the next line after after the \`-===-\`.

In addition, markdown is also supported.
ie - \`[link text](link url)\`
            `
        }, {
            name: "Example:",
            value: `Although quite bland this demonstrates most
\`\`\`
@corki define test
(tĕst) [Synonyms](https://www.thesaurus.com/browse/test)
-===-
:noun
1. The means by which the presence, quality, or genuineness of anything is determined; a means of trial.
2. a particular process or method for trying or assessing.
-==-
:verb
1. (with object) to subject to a test of any kind; try.
2. to undergo/perform/conduct a test or trial; try out.
-=====-
:Origin
1350–1400; Middle English: cupel < Middle French < Latin testū, testum earthen pot; akin to test

\`\`\`
            `
        }
    ]
}};
