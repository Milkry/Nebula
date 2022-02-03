const { getVoiceConnection } = require('@discordjs/voice');

exports.run = (client, message, args) => {
    const connection = getVoiceConnection(client.config.guildId);
    if (!connection) {
        connection.destroy();
        message.reply('Bot disconnected.');
    } else {
        message.reply('Failed to disconnect bot.');
    }
}