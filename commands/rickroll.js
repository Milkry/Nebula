const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const helper = require("../Components/helper_functions.js");

module.exports = {
    active: true,
    name: 'rickroll',
    description: 'Joins a channel and plays the rick roll song',
    aliases: ['rr'],
    developerOnly: true,
    permissionBypassers: [],
    permissions: [],
    cooldown: 0,
    run: async (client, message, args) => {
        try {
            // Command Parameters
            const channelID = args[0];

            // Validate
            message.delete();
            if (!channelID) {
                return helper.createEmbedResponseAndSend(`:x: Please provide a channel ID`, client.theme.Fail, message.author);
            }
            if (isNaN(channelID)) {
                return helper.createEmbedResponseAndSend(`:x: Please provide a valid channel ID`, client.theme.Fail, message.author);
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
                return helper.createEmbedResponseAndSend(`:white_check_mark: Successfully rickrolled the entire voice channel`, client.theme.Success, message.author);
            });
            player.on(AudioPlayerStatus.Idle, async () => {
                helper.createEmbedResponseAndSend(`:white_check_mark: Audio finished playing...`, client.theme.Success, message.author);
                return connection.destroy();
            });
        }
        catch (e) {
            helper.reportCommandError(e, client.theme.Fail, message, module.exports.name);
        }
    }
}