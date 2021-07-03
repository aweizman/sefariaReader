const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
const fetch = require('node-fetch');

client.once('ready', () => {
	console.log('Ready!');
});

var delim = '!'; //standard delimiter for commands. default is !, but can be changed.
var reply;
client.on('message', async message => {
	console.log(message.author + ': ' + message.content); //logs every message
	//!ping returns Pong
	if (message.content === delim + 'ping') {
		message.reply('Pong!');
	} 
	//!daily returns daily content from Calendar API
	else if (message.content === delim + 'daily') {

		const { daily } = await fetch('http://www.sefaria.org/api/calendars?timezone=America/New_York').then(response => response.json());

		message.reply(daily);
	}
	//!parsha returns weekly parsha
	else if (message.content === delim + 'parsha') {

		const { parsha } = await fetch('http://www.sefaria.org/api/calendars?timezone=America/New_York').then(res => res.json());

		reply = new Discord.MessageEmbed()
		.setTitle('test title')
		.setDescription('this is a test');
		message.reply(reply);
		
		//var parshaContent = https.request.get('http://www.sefaria.org/api/text/' + JSON.stringify(dailyContent.url));
		//message.channel.send(JSON.stringify(dailyContent.title) + ':\n' + JSON.stringify(parshaContent.text));
	}


});

client.login(process.env.TOKEN);