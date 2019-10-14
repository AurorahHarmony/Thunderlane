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

const findOrCreate = require('mongoose-findorcreate');

//Database Schema
const guildSchema = new mongoose.Schema({
	guildID: { type: String, required: true },
	prefix: String
});

guildSchema.plugin(findOrCreate);

const Guild = mongoose.model('Guild', guildSchema);

const { Client, RichEmbed, Collection } = require('discord.js');
const client = new Client({
	disableEveryone: true
});

client.commands = new Collection();
client.aliases = new Collection();

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

client.on('message', async message => {
	console.log(`${message.author.tag} said: ${message.content}`);

	Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
		console.log(guild.prefix);
		if (err) {
			console.log(err);
		}
	});

	const prefix = '++';

	if (message.author.bot) return;
	if (!message.guild) return;
	if (!message.content.startsWith(prefix)) return;
	if (!message.member) message.member = await message.guild.fetchMember(message);

	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const cmd = args.shift().toLowerCase();

	if (cmd.length === 0) return;

	let command = client.commands.get(cmd);
	if (!command) command = client.commands.get(client.aliases.get(cmd));

	if (command) command.run(client, message, args);
});

client.login(process.env.TOKEN);
