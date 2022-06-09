const { MessageEmbed } = require("discord.js");
const nhentai = require('nhentai-js')
const helper = require('../Components/helper_functions.js')

module.exports = {
    name: 'nhentai',
    description: 'Resolves nhentai codes to doujins',
    aliases: ['nh'],
    access: [],
    run: async (client, message, args) => {
        // Access
        if (helper.hasAccess(module.exports.access, message.author.id)) return message.channel.send(helper.noPermission);

        try {
            // Command Parameters
            const nhentaiCode = args[0];
            const publicMode = args[1];
            const user = message.mentions.users.first();

            // Validate
            if (!nhentaiCode) {
                return message.channel.send({ embeds: [await helper.createEmbedResponse(':x: Code not provided. Please include one.', client.theme.Fail)] });
            }
            if (isNaN(nhentaiCode) || nhentaiCode <= 0) {
                return message.channel.send({ embeds: [await helper.createEmbedResponse(':x: This is not a valid nHentai code. Please input a new one.', client.theme.Fail)] });
            }

            // Process
            try {
                if (await nhentai.exists(nhentaiCode)) {
                    const dojin = await nhentai.getDoujin(nhentaiCode);
                    const response = new MessageEmbed()
                        .setColor(client.theme.Neutral)
                        .setTitle(dojin.title)
                        .setDescription(`**Link:** ${dojin.link}\n**Languages:** ${dojin.details.languages}\n**Tags:** ${dojin.details.tags}\n**Length:** ${dojin.details.pages} page(s)\n**Uploaded:** ${dojin.details.uploaded}`)
                        .setImage(dojin.thumbnails[0])
                        .setThumbnail("https://i.imgur.com/uLAimaY.png")
                        .setTimestamp();

                    if (publicMode === '-p') {
                        await message.channel.send({ embeds: [response] });
                    }
                    else if (user) {
                        await message.delete();
                        await user.send(`From <@${message.author.id}>`);
                        await user.send({ embeds: [response] });
                    }
                    else {
                        await message.delete();
                        await message.author.send({ embeds: [response] });
                    }
                }
            }
            catch (e) {
                console.error(e);
                await message.delete();
                await message.author.send(`This is either not a valid doujin number or the servers are busy. Please try again.`);
            }
        }
        catch (e) {
            console.error(`The command [**${module.exports.name}**] has failed with an error of...\n`, e);
        }
    }
}