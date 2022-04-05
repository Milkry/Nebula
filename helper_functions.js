const { MessageEmbed } = require('discord.js');

module.exports = {
    createEmbedResponse: async (message) => {
        const embedMsg = new MessageEmbed()
            .setDescription(message)
        return embedMsg;
    },
    sleep: async (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}

//message.channel.send({ embeds: [await helper.createEmbedResponse(``)] });
//await sleep(ms);