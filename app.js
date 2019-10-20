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
const User = require('./models/user');

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

	const status = [
		{
			status: 'online',
			game: {
				name: 'your commands. Type ++help',
				type: 'LISTENING'
			}
		},
		{
			status: 'online',
			game: {
				name: `Null servers`,
				type: 'WATCHING'
			}
		},
		{
			status: 'online',
			game: {
				name: `Null users`,
				type: 'WATCHING'
			}
		}
	];

	client.user.setPresence(status[0]);

	let statusIndex = 0;
	let inServers = 0;

	Guild.countDocuments({}, (err, count) => {
		inServers = count;
	});

	setInterval(() => {
		Guild.estimatedDocumentCount({}, (err, count) => {
			inServers = count;
		});
	}, 60000);

	setInterval(() => {
		if (statusIndex < status.length - 1) {
			statusIndex++;
		} else {
			statusIndex = 0;
		}

		if (statusIndex === 1) status[1].game.name = `${inServers} servers`;
		client.user.setPresence(status[statusIndex]);
	}, 5000);
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
	const prefix = '++';
	let guildPrefix = prefix;

	if (message.guild) {
		// foundGuild = await Guild.findOne({ guildID: message.guild.id });
		client.foundGuild = await Guild.findOne({ guildID: message.guild.id });
		guildPrefix = client.foundGuild.prefix;
	}

	if (message.author.bot) return;

	client.foundUser = await User.findOrCreate({ userID: message.member.id }, { xp: '' });

	console.log(`${message.author.tag} said: ${message.content}`);
	// if (!message.guild) return;
	if (!message.content.startsWith(prefix) && !message.content.startsWith(guildPrefix)) return;
	if (!message.member && message.guild) message.member = await message.guild.fetchMember(message);

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

	if (!command.supportsDM && message.channel.type !== 'text') {
		return message.reply("I can't execute that command inside DMs!");
	}

	if (command) command.run(client, message, args);
});

client.login(process.env.TOKEN);
