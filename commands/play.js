const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    joinVoiceChannel,
    VoiceConnectionStatus,
    createAudioPlayer,
    NoSubscriberBehavior
} = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Joins the requested voice channel and plays a video (sound)')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select a channel to join to')
                .setRequired(true)),
    async execute(interaction) {
        const vc = interaction.options.getChannel('channel')
        
        const audioPlayer = createAudioPlayer({
	        behaviors: {
		        noSubscriber: NoSubscriberBehavior.Pause,
	        },
        });

        // Join voice channel
        const connection = joinVoiceChannel({
            channelId: vc.id,
            guildId: vc.guildId,
            adapterCreator: vc.guild.voiceAdapterCreator,
        })
        if (connection) {
            await interaction.reply({
                content: `Successfully connected to #${vc.name}`,
                ephemeral: true
            });
        }
        
        
        /*
        // Subscribe the connection to the audio player (will play audio on the voice connection)
        const subscription = connection.subscribe(audioPlayer);
        // subscription could be undefined if the connection is destroyed!
        if (subscription) {
	        // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
	        setTimeout(() => subscription.unsubscribe(), 5_000);
        }*/
    },
};