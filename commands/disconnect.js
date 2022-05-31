const { getVoiceConnection } = require('@discordjs/voice');
const helper = require('../helper_functions.js')

module.exports = {
    name: 'disconnect',
    description: 'Disconnects the bot from any connected voice channels',
    aliases: ['disc'],
    run: async (client, message, args) => {
        // Access
        const access = [process.env.OWNER_ID];
        if (!access.includes(message.author.id)) return;

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