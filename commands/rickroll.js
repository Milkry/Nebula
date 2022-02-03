const { joinVoiceChannel, createAudioPlayer, VoiceConnectionStatus, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    name: 'rickroll',
    description: 'Joins a channel and plays the rick roll song',
    run: async (client, message, args) => {
        if (message.author.id !== client.config.myId) return;
        // Get the channel object using the id given
        const channel = message.guild.channels.cache.get(args[0]); // change it to catch the error and exit if arg is not an id

        message.delete();
        const audioPlayer = createAudioPlayer();
        const resource = createAudioResource('sounds/NeverGonnaGiveYouUp.mp3');
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        audioPlayer.play(resource);
        connection.subscribe(audioPlayer);

        audioPlayer.on(AudioPlayerStatus.Playing, () => {
            message.author.send(":white_check_mark: Successfull rickroll!");
        });
    }
}