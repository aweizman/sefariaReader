const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	console.log(message.author + ': ' + message.content);
	if (message.content === '!ping') {
		message.channel.send('Pong');
	}
});

client.login(process.env.TOKEN);