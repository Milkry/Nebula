const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'disconnect',
    description: 'Disconnects the bot from any connected voice channels',
    aliases: ['disc'],
    run: async (client, message, args) => {
        const access = [client.config.myId];
        if (!access.includes(message.author.id)) return;

        await message.delete().catch(e => console.error(e));
        const connection = getVoiceConnection(message.guildId);
        if (connection) {
            connection.destroy();
        } else {
            await message.author.send(":x: Failed to disconnect bot.");
        }
    }
}