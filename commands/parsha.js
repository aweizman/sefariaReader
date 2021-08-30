const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('parsha')
		.setDescription('Replies with the weekly parsha'),
	async execute(interaction) {

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

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
		var sectionMax = text.length;

		collector.on('collect', async button => {
			if (button.customId === 'next') {
				section++;
				// update message
				await button.update({});
				if (section == sectionMax-1){
					// update next button to be disabled
					button.update({
						components: [backBtn, linkBtn, nextBtn.setDisabled(true)]
					});
				}
				if (section == 1) {
					// update back button to not be disabled
					button.update({
						components: [backBtn.setDisabled(false), linkBtn, nextBtn]
					});
				}
			} else if (button.customId === 'back') {
				section--;
				// update message
				await button.update({});
				if (section == 0) {
					// update back button to be disabled
					button.update({
						components: [backBtn.setDisabled(true), linkBtn, nextBtn]
					});
				}
				if (section == sectionMax-2) {
					// update next button to not be disabled
					button.update({
						components: [backBtn, linkBtn, nextBtn.setDisabled(false)]
					});
				}
			}
		});

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
				parsha.addField('*', segment, false);
			});			
		});

		// buttons to link to original text
		const linkBtn = new MessageButton() // links back to the original text on sefaria.org
			.setURL('http://www.sefaria.org/' + calendar_items[0].url)
			.setLabel('Link')
			.setStyle('LINK');

		var nextBtn = new MessageButton()
			.setCustomId('next')
			.setLabel('Next')
			.setStyle('PRIMARY')
			.setDisabled(false)

		var backBtn = new MessageButton()
			.setCustomId('back')
			.setLabel('Back')
			.setStyle('PRIMARY')
			.setDisabled(true)

		const row = new MessageActionRow()
			.addComponents(
				backBtn,
				linkBtn,
				nextBtn,
			)
		
		await interaction.reply({ ephemeral: false, embeds: [parsha], components: [row] });
	},
};