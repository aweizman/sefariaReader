const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('Replies with a picture of a cat!'),
	async execute(interaction) {
		const { file } = await fetch('https://aws.random.cat/meow')
			.then(response => response.json());

		await interaction.reply(file);
	},
};