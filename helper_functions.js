const { MessageEmbed } = require('discord.js');

module.exports = {
    createEmbedResponse: async (message) => {
        const embedMsg = new MessageEmbed()
            .setDescription(message)
        return embedMsg;
    }
}

//message.channel.send({ embeds: [await helper.createEmbedResponse(``)] });