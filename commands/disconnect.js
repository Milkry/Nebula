const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'disconnect',
    description: 'Disconnects the bot from any connected voice channels',
    run: async (client, message, args) => {
        if (message.author.id !== client.config.myId) return;

        const connection = getVoiceConnection(client.config.guildId);
        if (connection) {
            connection.destroy();
            message.reply('Bot disconnected.');
        } else {
            message.reply('Failed to disconnect bot.');
        }
    }
}