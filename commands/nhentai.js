const { EmbedBuilder } = require("discord.js");
const nhentai = require('nhentai-js')
const helper = require('../Components/helper_functions.js')

module.exports = {
    active: false,
    name: 'nhentai',
    description: 'Resolves nhentai codes to doujins',
    aliases: ['nh'],
    developerOnly: false,
    permissionBypassers: [],
    permissions: [],
    cooldown: 0,
    run: async (client, message, args) => {
        try {
            // Command Parameters
            const nhentaiCode = args[0];
            const publicMode = args[1];
            const user = message.mentions.users.first();

            // Validate
            if (!nhentaiCode) {
                return helper.createEmbedResponseAndSend(`:x: Code not provided. Please include one`, client.theme.Fail, message.channel);
            }
            if (isNaN(nhentaiCode) || nhentaiCode <= 0) {
                return helper.createEmbedResponseAndSend(`:x: This is not a valid nHentai code. Please input a new one`, client.theme.Fail, message.channel);
            }

            // Process
            try {
                if (await nhentai.exists(nhentaiCode)) {
                    const doujin = await nhentai.getDoujin(nhentaiCode);
                    const response = new EmbedBuilder()
                        .setColor(client.theme.Neutral)
                        .setTitle(doujin.title)
                        .setDescription(`**Link:** ${doujin.link}\n**Languages:** ${doujin.details.languages}\n**Tags:** ${doujin.details.tags}\n**Length:** ${doujin.details.pages} page(s)\n**Uploaded:** ${doujin.details.uploaded}`)
                        .setImage(doujin.thumbnails[0])
                        .setThumbnail("https://i.imgur.com/uLAimaY.png")
                        .setTimestamp();

                    if (publicMode === "-p") {
                        message.channel.send({ embeds: [response] });
                    }
                    else if (user) {
                        message.delete();
                        await user.send(`From <@${message.author.id}>`);
                        await user.send({ embeds: [response] });
                    }
                    else {
                        message.delete();
                        message.author.send({ embeds: [response] });
                    }
                }
                else {
                    message.delete();
                    helper.createEmbedResponseAndSend(`:x: The doujin requested with code [${nhentaiCode}] does not exist.`, client.theme.Fail, message.author);
                }
            }
            catch (e) {
                console.error(e);
                await message.delete();
                helper.createEmbedResponseAndSend(`This is either not a valid doujin number or the servers are busy. Please try again`, client.theme.Fail, message.author);
            }
        }
        catch (e) {
            helper.reportCommandError(e, client.theme.Fail, message, module.exports.name);
        }
    }
}