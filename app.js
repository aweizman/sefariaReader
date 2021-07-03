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

	console.log(message.author + ': ' + message.content); //logs every message

	//!ping returns Pong
	if (message.content === delim + 'ping') {
		message.reply('Pong!');
	}
	else if (message.content === delim + 'cat') {
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());

		message.channel.send(file);
	} 
	//!daily returns daily content from Calendar API
	else if (message.content === delim + 'daily') {

		const { calendar_items } = await fetch('http://www.sefaria.org/api/calendars?timezone=America/New_York').then(response => response.json());

		message.channel.send(calendar_items[0].title.en + '\n' + calendar_items[0].title.he);
	}
	//!parsha returns weekly parsha
	else if (message.content === delim + 'parsha') {

		const { calendar_items } = await fetch('http://www.sefaria.org/api/calendars?timezone=America/New_York').then(res => res.json());

		//const { text } = await fetch('http://www.sefaria.org/api/text' + calendar_items[0].url).then(res => res.json());

		const parsha = new MessageEmbed()
		.setTitle(calendar_items[0].title.en + ' | ' + calendar_items[0].title.he)
		.setColor(0xff0000)
		.setDescription('test description');
		
		
		//var parshaContent = https.request.get('http://www.sefaria.org/api/text/' + JSON.stringify(dailyContent.url));
		//message.channel.send(JSON.stringify(dailyContent.title) + ':\n' + JSON.stringify(parshaContent.text));
	}


});

client.login(process.env.TOKEN);