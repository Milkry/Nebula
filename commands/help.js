const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'help',
    description: 'Displays a help menu',
    run: async (client, message, args) => {
        const access = [client.config.myId];
        const helpDescription = `
            Prefix: [ **.** ]
            \n> rickroll {channelId}
            \n> dmrr {@user}
            \n> disconnect
            \n> reload {command name}
            \n> nh {code} {optional: -s}`;
        if (!access.includes(message.author.id)) return;

        message.delete();
        const helpMenu = new MessageEmbed()
            .setColor('#4500d9')
            .setTitle('Help Menu')
            .setDescription(helpDescription)
            .setTimestamp()
        message.author.send({ embeds: [helpMenu] });
    }
}