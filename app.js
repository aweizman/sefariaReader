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
	//!daily returns daily content from Calendar API
	else if (message.content === delim + 'daily') {

		const { daily } = await fetch('http://www.sefaria.org/api/calendars?timezone=America/New_York').then(response => response.json());

		message.channel.send(daily.calendar_items[0].he);
	}
	//!parsha returns weekly parsha
	else if (message.content === delim + 'parsha') {

		const { parsha } = await fetch('http://www.sefaria.org/api/calendars?timezone=America/New_York').then(res => res.json());

		message.channel.send(parsha.calendar_items[0].en);
		
		//var parshaContent = https.request.get('http://www.sefaria.org/api/text/' + JSON.stringify(dailyContent.url));
		//message.channel.send(JSON.stringify(dailyContent.title) + ':\n' + JSON.stringify(parshaContent.text));
	}


});

client.login(process.env.TOKEN);