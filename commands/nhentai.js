const { MessageEmbed } = require("discord.js");
const nhentai = require('nhentai-js')
const helper = require('../helper_functions.js')

module.exports = {
    name: 'nhentai',
    description: 'Resolves nhentai codes to doujins',
    aliases: ['nh'],
    run: async (client, message, args) => {
        try {
            // Access
            //const access = [process.env.OWNER_ID];
            //if (!access.includes(message.author.id)) return;

            // Command Parameters
            const nhentaiCode = args[0];
            const silentMode = args[1];

            // Validate
            if (!nhentaiCode) {
                return message.channel.send({ embeds: [await helper.createEmbedResponse(':x: Code not provided. Please include one.', client.theme.Fail)] });
            }
            if (isNaN(nhentaiCode)) {
                return message.channel.send({ embeds: [await helper.createEmbedResponse(':x: This is not a valid nHentai code. Please input a new one.', client.theme.Fail)] });
            }

            // Process
            if (nhentai.exists(nhentaiCode)) {
                try {
                    const dojin = await nhentai.getDoujin(nhentaiCode);
                    const response = new MessageEmbed()
                        .setColor(client.theme.Neutral)
                        .setTitle(`**${dojin.title}**`)
                        .setDescription(`**Link:** ${dojin.link}\n**Languages:** ${dojin.details.languages}\n**Tags:** ${dojin.details.tags}\n**Length:** ${dojin.details.pages}\n**Uploaded:** ${dojin.details.uploaded}`)
                        .setImage(dojin.thumbnails[0])
                        .setTimestamp()
                    if (silentMode === '-s') {
                        message.delete();
                        message.author.send({ embeds: [response] });
                    } else {
                        message.channel.send({ embeds: [response] });
                    }
                } catch (e) {
                    console.error(e);
                    if (silentMode === '-s') {
                        message.delete();
                        message.author.send(`This is either not a valid doujin number or the servers are busy. Please try again.`);
                    }
                    else {
                        message.channel.send(`This is either not a valid doujin number or the servers are busy. Please try again.`);
                    }
                }
            }
        }
        catch (e) {
            console.error(`The command [**${module.exports.name}**] has failed with an error of...`, e);
        }
    }
}