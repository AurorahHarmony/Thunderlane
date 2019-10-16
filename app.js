require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
	console.log('Error in MongoDb connection: ' + err);
});

let db = mongoose.connection;

db.on('connecting', function() {
	console.log('connecting to MongoDB...');
});

db.on('connected', function() {
	console.log('MongoDB connected!');
});
db.once('open', function() {
	console.log('MongoDB connection opened!');
});
db.on('reconnected', function() {
	console.log('MongoDB reconnected!');
});

db.on('disconnected', function() {
	console.log('MongoDB disconnected!');
	mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
		console.log('Error in MongoDb connection: ' + err);
	});
});

const Guild = require('./models/guild');

const { Client, RichEmbed, Collection } = require('discord.js');
const client = new Client({
	disableEveryone: true
});

const fs = require('fs');

client.commands = new Collection();
client.aliases = new Collection();
client.config = require('./config.json');
client.categories = fs.readdirSync('./commands/');

['command'].forEach(handler => {
	require(`./handler/${handler}`)(client);
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);

	client.user.setPresence({
		status: 'online',
		game: {
			name: '- ++help to see a list of commands',
			type: 'WATCHING'
		}
	});
});

client.on('guildCreate', guild => {
	//Check if guild already has database
	Guild.findOrCreate({ guildID: guild.id }, { guildName: guild.name }, function(err, Guild, created) {
		if (created) {
			console.log(`Joined new guild: ${guild.name} (${guild.id})`);
		} else {
			console.log(`Rejoined guild: ${guild.name} (${guild.id})`);
		}
	});
});

client.on('guildUpdate', async (oldGuild, newGuild) => {
	await Guild.updateOne(
		{ guildID: oldGuild.id },
		{
			guildName: newGuild.name
		}
	);
});

client.on('message', async message => {
	console.log(`${message.author.tag} said: ${message.content}`);

	const foundGuild = await Guild.findOne({ guildID: message.guild.id });
	client.foundGuild = foundGuild;

	const prefix = '++';
	const guildPrefix = foundGuild.prefix;

	if (message.author.bot) return;
	if (!message.guild) return;
	if (!message.content.startsWith(prefix) && !message.content.startsWith(guildPrefix)) return;
	if (!message.member) message.member = await message.guild.fetchMember(message);

	let args;
	if (message.content.startsWith(prefix)) {
		args = message.content
			.slice(prefix.length)
			.trim()
			.split(/ +/g);
	} else if (message.content.startsWith(guildPrefix)) {
		args = message.content
			.slice(guildPrefix.length)
			.trim()
			.split(/ +/g);
	}

	const cmd = args.shift().toLowerCase();

	if (cmd.length === 0) return;

	let command = client.commands.get(cmd);
	if (!command) command = client.commands.get(client.aliases.get(cmd));

	if (command) command.run(client, message, args, foundGuild);
});

client.login(process.env.TOKEN);
