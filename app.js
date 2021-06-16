const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config();

client.once('ready', () => {
	console.log('Ready!');
});

client.login('your-token-goes-here');