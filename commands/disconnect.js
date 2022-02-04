const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'disconnect',
    description: 'Disconnects the bot from any connected voice channels',
    run: async (client, message, args) => {
        if (message.author.id !== client.config.myId) return;

        message.delete();
        const connection = getVoiceConnection(message.guildId);
        if (connection) {
            connection.destroy();
        } else {
            await message.author.send(":x: Failed to disconnect bot.");
        }
    }
}