require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

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

//Listener for messages
client.on('message', message => {
	console.log(`${message.guild.id} | ${message.member.user.tag} - ${message.content}`);

	if (message.content === 'ping') {
		message.channel.send('pong');
	}
});

//Login Bot using token from environment variable
client.login(process.env.TOKEN);
