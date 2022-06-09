const { getVoiceConnection } = require('@discordjs/voice');
const helper = require('../Components/helper_functions.js');

module.exports = {
    name: 'disconnect',
    description: 'Disconnects the bot from any connected voice channels',
    aliases: ['disc'],
    access: [process.env.OWNER_ID],
    run: async (client, message, args) => {
        // Access
        if (helper.hasAccess(module.exports.access, message.author.id)) return message.channel.send(helper.noPermission);

        // Process
        message.delete();
        const connection = getVoiceConnection(message.guildId);
        if (connection) {
            connection.destroy();
        } else {
            message.author.send({ embeds: [await helper.createEmbedResponse(`:x: Bot is not connected anywhere.`, client.theme.Fail)] });
        }
    }
}