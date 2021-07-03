const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
const fetch = require('node-fetch');

client.once('ready', () => {
	console.log('Ready!');
});

var delim = '!'; //standard delimiter for commands. default is !, but can be changed.
var reply;
client.on('message', message => {
	console.log(message.author + ': ' + message.content); //logs every message
	//!ping returns Pong
	if (message.content === delim + 'ping') {
		message.reply('Pong!');
	} 
	//!daily returns daily content from Calendar API
	else if (message.content === delim + 'daily') {
		fetch('http://www.sefaria.org/api/calendars')
		.then(res => res.json())
		.then(json => {reply = new Discord.MessageEmbed()
			.setTitle('Daily Content:')
			.setColor(0xff0000)
			.setDescription(json)});

		message.reply(reply);
	}
	//!parsha returns weekly parsha
	else if (message.content === delim + 'parsha') {
		fetch('http://www.sefaria.org/api/calendars')
		.then(res => res.json())
		.then(json => console.log(json));
		
		//var parshaContent = https.request.get('http://www.sefaria.org/api/text/' + JSON.stringify(dailyContent.url));
		//message.channel.send(JSON.stringify(dailyContent.title) + ':\n' + JSON.stringify(parshaContent.text));
	}


});

client.login(process.env.TOKEN);