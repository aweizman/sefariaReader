const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('parsha')
		.setDescription('Replies with the weekly parsha'),
	async execute(interaction) {

        // FIXME: API currently returns entire chapter, rather than exact parsha

        const { calendar_items } = await fetch('http://www.sefaria.org/api/calendars?timezone=America/New_York').then(res => res.json());

		const { text } = await fetch('http://www.sefaria.org/api/texts/' + calendar_items[0].url).then(res => res.json());

		var sectionNums = calendar_items[0].url.split(/[-.]/g); // [2] and [4] of sectionNums are the start and end lines of the parsha

		var sectionStart = sectionNums[2];

		var sectionEnd = sectionNums[4];

		var section = 0;
		// var sectionMax = text.length;

		// initial display
		const parsha = new MessageEmbed()
		.setTitle(calendar_items[0].title.en + ' | ' +  calendar_items[0].displayValue.en + '\n ' + calendar_items[0].title.he + ' | ' + calendar_items[0].displayValue.he)
		.setColor(0x212e50)
		.setDescription(text[section].map(s => s.replace(/\<\/?i\>/g, '')));


		// buttons for navigation (inactive for now)
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton() // links back to the original text on sefaria.org
				.setUrl('http://www.sefaria.org/api/texts/' + calendar_items[0].url)
				.setLabel('Link')
				.setStyle('LINK'),
			)
		
		await interaction.reply({ content: 'TEST', ephemeral: true, embeds: [parsha], components: [row] });
	},
};