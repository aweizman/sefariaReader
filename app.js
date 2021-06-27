const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();

client.once('ready', () => {
	console.log('Ready!');
});

var delim = '!'; //standard delimiter for commands. default is !, but can be changed.

client.on('message', message => {
	console.log(message.author + ': ' + message.content); //logs every message
	//!ping returns Pong
	if (message.content === delim + 'ping') {
		message.channel.send('Pong');
	} 
	//!parsha returns weekly parsha
	else if (message.content === delim + 'parsha') {

	}


});

client.login(process.env.TOKEN);