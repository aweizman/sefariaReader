const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
const requests = require('request');

client.once('ready', () => {
	console.log('Ready!');
});

var fs = require("fs");

var delim = '!'; //standard delimiter for commands. default is !, but can be changed.

client.on('message', message => {
	console.log(message.author + ': ' + message.content); //logs every message
	//!ping returns Pong
	if (message.content === delim + 'ping') {
		message.channel.send('Pong');
	} 
	//!daily returns daily content from Calendar API
	else if (message.content === delim + 'daily') {
		//var dailyContent = requests.get('http://www.sefaria.org/api/calendars?timezone=America/New_York'); //FIXME: change to get timezone based on user input
		var response = 'this feature is currently unavailable';
		message.channel.send(response);
	}
	//!parsha returns weekly parsha
	else if (message.content === delim + 'parsha') {
		var dailyContent = requests.get('http://www.sefaria.org/api/calendars');
		var parshaContent = requests.get('http://www.sefaria.org/api/text/' + JSON.stringify(dailyContent.calendar_items.url));
		message.channel.send(JSON.stringify(dailyContent.calendar_items.title) + ':\n' + JSON.stringify(parshaContent.text));
	}


});

client.login(process.env.TOKEN);