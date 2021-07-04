const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
require('dotenv').config();
const fetch = require('node-fetch');

client.once('ready', () => {
	console.log('Ready!');
});

var delim = '!'; //standard delimiter for commands. default is !, but can be changed.
var reply;
client.on('message', async message => {

	if (!message.content.startsWith(delim) || message.author.bot) return; //bot does not need to worry about messages w/ out delim or messages sent by itself

	console.log(message.author + ': ' + message.content); //logs every command made

	//!ping returns Pong
	if (message.content === delim + 'ping') {
		message.reply('Pong!');
	}
	else if (message.content === delim + 'cat') {
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());

		message.channel.send(file);
	} 
	//!daily returns daily content from Calendar API (for now, only returns name of parsha)
	else if (message.content === delim + 'daily') {

		const { calendar_items } = await fetch('http://www.sefaria.org/api/calendars?timezone=America/New_York').then(response => response.json());

		message.channel.send(calendar_items[0].title.en + '\n' + calendar_items[0].title.he);
	}
	//!parsha returns first section of weekly parsha, embed description is edited when reacted w/ emote
	//FIXME: API currently returns entire chapter, rather than exact parsha
	else if (message.content === delim + 'parsha') {

		const { calendar_items } = await fetch('http://www.sefaria.org/api/calendars?timezone=America/New_York').then(res => res.json());

		const { text } = await fetch('http://www.sefaria.org/api/texts/' + calendar_items[0].url).then(res => res.json());

		var sectionNums = calendar_items[0].url.split(/[-.]/g); //[2] and [4] are the start and end lines of the parsha

		var sectionStart = sectionNums[2];

		var sectionEnd = sectionNums[4];

		var section = 0;
		var sectionMax = text.length;

		const parsha = new MessageEmbed()
		.setTitle(calendar_items[0].title.en + ' | ' +  calendar_items[0].displayValue.en + '\n ' + calendar_items[0].title.he + ' | ' + calendar_items[0].displayValue.he)
		.setColor(0x212e50)
		.setDescription(text[section].map(s => s.replace(/\<\/?i\>/g, '')));
		
		message.channel.send(parsha);
	}


});

client.login(process.env.TOKEN);