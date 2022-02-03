const { joinVoiceChannel, createAudioPlayer, VoiceConnectionStatus, createAudioResource } = require('@discordjs/voice');

exports.run = (client, message, args) => {
    message.channel.send("Never gonna give you up. Never gonna let you down...").catch(console.error);

    if (!args[0]) {
        console.log(message.author.id);
        client.users.
        return;
    }
    // Get the channel object using the id given
    const channel = message.guild.channels.cache.get(args[0]);

    const audioPlayer = createAudioPlayer();
    const resource = createAudioResource('rick.mp3');
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
    const subscription = connection.subscribe(audioPlayer);
    setTimeout(() => audioPlayer.play(resource), 3000);
}