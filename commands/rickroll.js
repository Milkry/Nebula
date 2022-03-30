const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    name: 'rickroll',
    description: 'Joins a channel and plays the rick roll song',
    aliases: ['rr'],
    run: async (client, message, args) => {
        const access = [client.config.myId];
        if (!access.includes(message.author.id)) return;

        message.delete();
        // Validate
        if (!args[0]) {
            message.author.send("Please provide a channel ID...");
            return;
        }
        if (!isNan(args[0])) {
            message.author.send("This is not a channel ID. Please provide a valid one.");
            return;
        }

        // Get the channel object using the id given
        const channel = message.guild.channels.cache.get(args[0]); // change it to catch the error and exit if arg is not an id
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
            await message.author.send(":white_check_mark: Audio finished playing. Now leaving to find bananas...");
            connection.destroy();
        })
    }
}