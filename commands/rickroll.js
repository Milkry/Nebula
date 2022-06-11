const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const helper = require("../Components/helper_functions.js");

module.exports = {
    active: true,
    name: 'rickroll',
    description: 'Joins a channel and plays the rick roll song',
    aliases: ['rr'],
    access: [process.env.OWNER_ID],
    cooldown: 0,
    run: async (client, message, args) => {
        try {
            // Command Parameters
            const channelID = args[0];

            // Validate
            message.delete();
            if (!channelID) {
                return message.author.send({ embeds: [await helper.createEmbedResponse(':x: Please provide a channel ID.', client.theme.Fail)] });
            }
            if (isNaN(channelID)) {
                return message.author.send({ embeds: [await helper.createEmbedResponse(':x: This is not a valid channel ID.', client.theme.Fail)] });
            }

            // Process
            const channel = message.guild.channels.cache.get(channelID);
            const player = createAudioPlayer();
            const resource = createAudioResource('resources/sounds/NeverGonnaGiveYouUp.mp3');
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            player.play(resource);
            connection.subscribe(player);

            player.on(AudioPlayerStatus.Playing, async () => {
                return message.author.send({ embeds: [await helper.createEmbedResponse(':white_check_mark: Successfully rickrolled the entire voice channel.', client.theme.Success)] });
            });
            player.on(AudioPlayerStatus.Idle, async () => {
                message.author.send({ embeds: [await helper.createEmbedResponse(':white_check_mark: Audio finished playing. Now leaving to find bananas...', client.theme.Success)] });
                return connection.destroy();
            });
        }
        catch (e) {
            helper.reportCommandError(e, client.theme.Fail, message, module.exports.name);
        }
    }
}