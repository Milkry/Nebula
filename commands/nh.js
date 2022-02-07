const { MessageEmbed } = require("discord.js");
const nhentai = require('nhentai-js')

module.exports = {
    name: 'nh',
    description: 'Resolves nhentai codes to doujins',
    run: async (client, message, args) => {
        //const access = [client.config.myId];
        //if (!access.includes(message.author.id)) return;
        if (isNaN(args[0]) || !args[0]) {
            message.channel.send(':x: nHentai code not provided. Please include one.');
            return;
        }

        const code = args[0];
        if (nhentai.exists(code)) {
            try {
                const dojin = await nhentai.getDoujin(code);
                const response = new MessageEmbed()
                    .setColor('#ff7369')
                    .setTitle(`**${dojin.title}**`)
                    .setDescription(`**Link:** ${dojin.link}\n**Languages:** ${dojin.details.languages}\n**Tags:** ${dojin.details.tags}\n**Length:** ${dojin.details.pages}\n**Uploaded:** ${dojin.details.uploaded}`)
                    .setImage(dojin.thumbnails[0])
                    .setTimestamp()
                if (args[1] === '-s') {
                    message.delete();
                    message.author.send({ embeds: [response] });
                } else {
                    message.channel.send({ embeds: [response] });
                }
            } catch (e) {
                console.error(e);
                message.author.send('nHentai servers seem to be busy. Please try again in a few minutes.');
            }
        }
    }
}