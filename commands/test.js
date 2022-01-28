const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('A command to test'),
	async execute(interaction) {
		await interaction.reply('test success!');
	},
};