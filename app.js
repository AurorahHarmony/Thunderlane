require('dotenv').config();

const { Client, RichEmbed } = require('discord.js');
const client = new Client();

//Initiate mongoDB connection using database specified in environment variable
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });

//Database Schema
const serverSchema = new mongoose.Schema({
	serverID: String
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

//Run code on join guild
client.on('guildCreate', guild => {
	console.log(`Joined a new guild: ${guild.name} (${guild.id})`);
	//Your other stuff like adding to guildArray
});

//Listener for messages
client.on('message', message => {
	console.log(`${message.guild.id} | ${message.member.user.tag} - ${message.content}`);

	if (message.content === 'ping') {
		message.channel.send('pong');
	}

	if (message.content === '!') {
		const embed = new RichEmbed()
			// Set the title of the field
			.setTitle('Rawrf')
			// Set the color of the embed
			.setColor(0xff0000)
			// Set the main content of the embed
			.setDescription('');
		message.channel.send(embed);
	}
});

//Login Bot using token from environment variable
client.login(process.env.TOKEN);
