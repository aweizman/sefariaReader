const { Client, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const client = new Client();
require('dotenv').config();
const fetch = require('node-fetch');

const commands = [
	{
		name: 'ping',
		description: 'replies with pong'
	},

	{
		name: 'cat',
		description: 'replies with a picture of a cat'
	},

	{
		name: 'daily',
		description: 'replies with daily texts (COMING SOON)'
	},

	{ 
		name: 'parsha',
		description: 'replies with this week\'s parsha reading'
	}

];

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {

	if (!interaction.isCommand()) return; // bot does not need to worry about messages w/ out delim or messages sent by itself

	console.log(interaction.author + ': ' + interaction.content); // logs every command made
	
	// /daily returns daily content from Calendar API (for now, only returns name of parsha)
	if (interaction.commandName === 'daily') {

		const { calendar_items } = await fetch('http://www.sefaria.org/api/calendars?timezone=America/New_York').then(response => response.json());

		await interaction.reply(calendar_items[0].title.en + '\n' + calendar_items[0].title.he);
	}
	// /parsha returns first section of weekly parsha, embed description is edited when reacted w/ emote
	// FIXME: API currently returns entire chapter, rather than exact parsha
	else if (interaction.commandName === 'parsha') {

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
	}


});

client.login(process.env.TOKEN);