const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('parsha')
		.setDescription('Replies with the weekly parsha'),
	async execute(interaction) {

        // FIXME: API currently returns entire chapter, rather than exact parsha

        const { calendar_items } = await fetch('http://www.sefaria.org/api/calendars?timezone=America/New_York')
			.then(response => response.json());

		const { text } = await fetch('http://www.sefaria.org/api/texts/Numbers.25.10-30.1')
			.then(response => response.json());
	
		//'http://www.sefaria.org/api/texts/' + calendar_items[0].url)

		var sectionNums = calendar_items[0].url.split(/[-.]/g); // [2] and [4] of sectionNums are the start and end lines of the parsha

		var sectionStart = sectionNums[2];

		var sectionEnd = sectionNums[4];

		var section = 0;
		// var sectionMax = text.length;

		// initial display
		const parsha = new MessageEmbed()
		.setTitle(calendar_items[0].title.en + ' | ' +  calendar_items[0].displayValue.en + '\n ' + calendar_items[0].title.he + ' | ' + calendar_items[0].displayValue.he)
		.setColor(0x212e50)
		// need to concat strings of each element in text[0]
		.addField('Parsha Text:', text[0].map(s => s.replace(/\<\/?i\>/g, '')), true);


		// buttons to link to original text
		const linkBtn = new MessageButton() // links back to the original text on sefaria.org
			.setURL('http://www.sefaria.org/api/texts/' + calendar_items[0].url)
			.setLabel('Link')
			.setStyle('LINK');

		const row = new MessageActionRow()
			.addComponents(
				linkBtn,
			)
		
		await interaction.reply({ ephemeral: false, embeds: [parsha], components: [row] });
	},
};