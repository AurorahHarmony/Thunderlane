require('dotenv').config();

//Initiate mongoDB connection using database specified in environment variable
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });
const findOrCreate = require('mongoose-findorcreate');

//Database Schema
const guildSchema = new mongoose.Schema({
	guildID: { type: String, required: true },
	prefix: String
});

guildSchema.plugin(findOrCreate);

const Guild = mongoose.model('Guild', guildSchema);

//Inititate discord instance
const { Client, RichEmbed } = require('discord.js');
const client = new Client();

//Announce server is ready
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

//Run code on join guild
client.on('guildCreate', guild => {
	//Check if guild already has database
	Guild.findOrCreate({ guildID: guild.id }, function(err, Guild, created) {
		if (created) {
			console.log(`Joined new guild: ${guild.name} (${guild.id})`);
		} else {
			console.log(`Rejoined guild: ${guild.name} (${guild.id})`);
		}
	});
});

//Listener for messages
client.on('message', msg => {
	if (!msg.guild) return;
	if (msg.author.bot) return;

	let guildPrefix;
	Guild.findOne({ guildID: msg.guild.id }, (err, guild) => {
		guildPrefix = guild.prefix;
		if (!msg.content.startsWith('++') && !msg.content.startsWith(guildPrefix)) return;
		console.log('Running Commands');

		if (msg.content.includes('serverInfo')) {
			const embed = new RichEmbed() // Set the main content of the embed
				// Set the title of the field
				.setTitle(`About ${msg.guild.name}`)
				// Set the color of the embed
				.setColor('b7ddde').setDescription(`ServerID: ${msg.guild.id}
	    Server Owner: ${msg.guild.owner} (${msg.guild.ownerID})`);
			msg.channel.send(embed);
		}
	});

	// console.log(guildPrefix);

	// if (message.content === prefix + 'prefix') {
	// 	message.channel.send('pong');
	// }

	// if (message.content === prefix + 'invite') {
	// 	message.channel.send('https://discordapp.com/oauth2/authorize?&client_id=632869587683115019rs&scope=bot&permissions=8');
	// }
	// if (message.content === prefix + 'ping') {
	// 	message.channel.send('pong');
	// }
});

//Login Bot using token from environment variable
client.login(process.env.TOKEN);
