require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

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

//Login Bot
client.login(process.env.TOKEN);
