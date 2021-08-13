const { Client, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const client = new Client();
require('dotenv').config();
const fs = require('fs');

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
});

client.login(process.env.TOKEN);