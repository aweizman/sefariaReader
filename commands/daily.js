const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Replies with links to the daily texts!'),
	async execute(interaction) {
        const { calendar_items } = await fetch('http://www.sefaria.org/api/calendars?timezone=America/New_York').then(response => response.json());

		await interaction.reply(calendar_items[0].title.en + '\n' + calendar_items[0].title.he);
	},
};