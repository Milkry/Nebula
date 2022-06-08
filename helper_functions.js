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
    sleep: async (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    },
    getUsername: async (Id, client) => {
        const user = await client.users.fetch(Id);
        return user.username;
    },
    hasAccess: (access, user) => {
        if (access.length === 0) return false; // Has access
        if (access.includes(user)) return false; // Has access
        return true; // Doesn't have access
    }
}

//message.channel.send({ embeds: [await helper.createEmbedResponse(``)] });
//await sleep(ms);