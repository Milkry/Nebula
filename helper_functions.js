const { MessageEmbed } = require('discord.js');

module.exports = {
    dbError: `:x: Something went wrong. Please contact <@${process.env.OWNER_ID}>`,
    createEmbedResponse: async (message, color) => {
        const embedMsg = new MessageEmbed()
            .setDescription(message)
            .setColor(color);
        return embedMsg;
    },
    sleep: async (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    },
    getUsername: async (Id, client) => {
        const user = await client.users.fetch(Id);
        return user.username;
    }
}

//message.channel.send({ embeds: [await helper.createEmbedResponse(``)] });
//await sleep(ms);