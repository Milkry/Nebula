const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    name: 'rickroll',
    description: 'Joins a channel and plays the rick roll song',
    run: async (client, message, args) => {
        const access = [client.config.myId];
        if (!access.includes(message.author.id)) return;
        // Get the channel object using the id given
        const channel = message.guild.channels.cache.get(args[0]); // change it to catch the error and exit if arg is not an id

        message.delete();
        const player = createAudioPlayer();
        const resource = createAudioResource('sounds/NeverGonnaGiveYouUp.mp3');
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Playing, async () => {
            await message.author.send(":white_check_mark: Successful rickroll!");
        });
        player.on(AudioPlayerStatus.Idle, async () => {
            await message.author.send(":white_check_mark: Audio finished playing. Now leaving...");
            connection.destroy();
        })
    }
}