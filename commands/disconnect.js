const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'disconnect',
    description: 'Disconnects the bot from any connected voice channels',
    run: async (client, message, args) => {
        if (message.author.id !== client.config.myId) return;

        const connection = getVoiceConnection(message.guildId);
        if (connection) {
            connection.destroy();
            await message.reply('Bot disconnected.');
        } else {
            await message.reply('Failed to disconnect bot.');
        }
    }
}