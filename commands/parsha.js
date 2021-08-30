const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('parsha')
		.setDescription('Replies with the weekly parsha'),
	async execute(interaction) {

        // FIXME: make it so that it displays by portion or by chapter. MAX 25 FIELDS.

        const { calendar_items } = await fetch('http://www.sefaria.org/api/calendars?timezone=America/New_York')
			.then(response => response.json());

	
		const textURL = 'http://www.sefaria.org/api/texts/' + calendar_items[0].url;
		console.log('URL: ' + textURL);

		const { text } = await fetch(textURL)
			.then(response => response.json());

		var sectionNums = calendar_items[0].url.split(/[-.]/g); // [2] and [4] of sectionNums are the start and end lines of the parsha

		var sectionStart = sectionNums[2];

		var sectionEnd = sectionNums[4];

		var section = 0;
		// var sectionMax = text.length;
		console.log('Chapters & verses: ' + calendar_items[0].url);
		console.log('Beginning & ending verses: ' + sectionStart + ' | ' + sectionEnd);

		// getting rid of <i> and </i> which can sometimes appear in text
		// sampleText = text[0].map(s => s.replace(/\<\/?i\>/g, ''));

		// trimming off front
		text[0].splice(0, sectionStart-1);

		// trimming off end
		text[text.length-1].splice(sectionEnd, text[text.length-1]-1);

		// getting rid of <i> and </i> which can sometimes appear in text. DOES NOT WORK
		var i = 0;
		text.forEach(element => {
			text[i] = element.map(s => s.replace(/\<\/?i\>/g, ''));
			i++;
		});

		// combining all strings into a single array element
		var parshaText = [];
		var i = 0;
		text.forEach(element => {
			element.forEach(segment => {
				parshaText[i] += segment;
			});			
			i++;
		});

		const parsha = new MessageEmbed()
		.setTitle(calendar_items[0].title.en + ' | ' +  calendar_items[0].displayValue.en + '\n ' + calendar_items[0].title.he + ' | ' + calendar_items[0].displayValue.he)
		.setColor(0x212e50);

		text.forEach(element => {
			element.forEach(segment => {
				parsha.addField('test', segment, false);
			});			
		});

		// buttons to link to original text
		const linkBtn = new MessageButton() // links back to the original text on sefaria.org
			.setURL('http://www.sefaria.org/' + calendar_items[0].url)
			.setLabel('Link')
			.setStyle('LINK');

		const row = new MessageActionRow()
			.addComponents(
				linkBtn,
			)
		
		await interaction.reply({ ephemeral: false, embeds: [parsha], components: [row] });
	},
};