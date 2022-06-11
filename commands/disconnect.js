const { getVoiceConnection } = require('@discordjs/voice');
const helper = require('../Components/helper_functions.js');

module.exports = {
    active: true,
    name: 'disconnect',
    description: 'Disconnects the bot from any connected voice channels',
    aliases: ['disc'],
    access: [process.env.OWNER_ID],
    cooldown: 0,
    run: async (client, message, args) => {
        try {
            // Process
            message.delete();
            const connection = getVoiceConnection(message.guildId);
            if (connection) {
                connection.destroy();
            } else {
                message.author.send({ embeds: [await helper.createEmbedResponse(`:x: Bot is not connected anywhere.`, client.theme.Fail)] });
            }
        }
        catch (e) {
            helper.reportCommandError(e, client.theme.Fail, message, module.exports.name);
        }
    }
}