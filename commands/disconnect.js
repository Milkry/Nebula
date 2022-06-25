const { getVoiceConnection } = require('@discordjs/voice');
const helper = require('../Components/helper_functions.js');

module.exports = {
    active: true,
    name: 'disconnect',
    description: 'Disconnects the bot from any connected voice channels',
    aliases: ['disc'],
    developerOnly: true,
    permissionBypassers: [],
    permissions: [],
    cooldown: 0,
    run: async (client, message, args) => {
        try {
            // Process
            message.delete();
            const connection = getVoiceConnection(message.guildId);
            if (connection) {
                connection.destroy();
            } else {
                helper.createEmbedResponseAndSend(`:x: Bot is not connected anywhere`, client.theme.Fail, message.author);
            }
        }
        catch (e) {
            helper.reportCommandError(e, client.theme.Fail, message, module.exports.name);
        }
    }
}