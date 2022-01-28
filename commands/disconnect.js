const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { guildId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Disconnects the bot from any ongoing voice channels.'),
    async execute(interaction) {
        const connection = getVoiceConnection(guildId);
        console.log(connection)
        if (connection != null) {
            connection.destroy();
            await interaction.reply({
                content: `Disconnected.`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: `Failed to disconnected. Please disconnect me manually.`,
                ephemeral: true
            });
        }
    },
};