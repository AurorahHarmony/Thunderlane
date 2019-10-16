const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = {
	name: 'help',
	aliases: ['h'],
	category: 'info',
	description: 'Returns all commands, or one specific command info',
	usage: '[command | alias]',
	run: async (client, message, args) => {
		if (args[0]) {
			return getCMD(client, message, args[0]);
		} else {
			return getAll(client, message);
		}
	}
};

function getAll(client, message) {
	const embed = new RichEmbed().setColor(client.config.color.bot).setTitle('Commands');

	const commands = category => {
		return client.commands.filter(cmd => cmd.category === category).map(cmd => `- ${cmd.name}`);
	};

	client.categories.forEach(e => {
		embed.addField(e.charAt(0).toUpperCase() + e.slice(1), commands(e), true);
	});

	embed.setFooter(`The prefix for this server is ${client.foundGuild.prefix || '++'}`);

	return message.channel.send(embed);
}

function getCMD(client, message, input) {
	const embed = new RichEmbed();

	const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

	let title = 'Unknown Command';
	let info = `I'm sorry but I can't find the command: \`${input.toLowerCase()}\`\nPlease try again`;

	if (!cmd) {
		return message.channel.send(
			embed
				.setColor(client.config.color.error)
				.setTitle(title)
				.setDescription(info)
		);
	}

	if (cmd.name) title = `${cmd.name.charAt(0).toUpperCase() + cmd.name.substring(1)}`;
	if (cmd.aliases) info = `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(', ')}`;
	if (cmd.description) info += `\n**Description**: ${cmd.description}`;
	if (cmd.usage) {
		info += `\n**Usage**: ${cmd.usage}`;
		embed.setFooter(`Syntax: <> = required, [] = optional`);
	}

	return message.channel.send(
		embed
			.setColor(client.config.color.bot)
			.setTitle(title)
			.setDescription(info)
	);
}
