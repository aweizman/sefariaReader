const { Client, MessageActionRow, MessageButton, Collection, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
require('dotenv').config();
const fs = require('fs');

client.commands = new Collection();

// takes all the command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}


client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {

	if (!interaction.isCommand()) return; // bot does not need to worry about messages w/ out delim or messages sent by itself

	console.log(interaction.author + ': ' + interaction.content); // logs every command made

	try {
		await client.commands.get(interaction.commandName).execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}

});

client.login(process.env.TOKEN);