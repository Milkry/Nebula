const { MessageEmbed } = require('discord.js');

module.exports = {
    noPermission: `<a:gigachad:944054257227825152> No`,
    dbError: `:x: Something went wrong. Please contact <@${process.env.OWNER_ID}>`,
    createEmbedResponse: async (message, color) => {
        const embedMsg = new MessageEmbed()
            .setDescription(message)
            .setColor(color);
        return embedMsg;
    },
    createEmbedResponseAndSend: async (message, color, channel) => {
        const embedMsg = new MessageEmbed()
            .setDescription(message)
            .setColor(color);
        await channel.send({ embeds: [embedMsg] });
    },
    sleep: async (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    },
    getUsername: async (Id, client) => {
        const user = await client.users.fetch(Id);
        return user.username;
    },
    reportCommandError: (error, color, message, cmd) => {
        console.error(`The command [${cmd}] has failed with an error of...\n`, error);
        const msg = new MessageEmbed()
            .setDescription(`Kati epien skata. <@${process.env.OWNER_ID}> ela sastaaa.`)
            .setColor(color)
        message.channel.send({ embeds: [msg] });
    }
}