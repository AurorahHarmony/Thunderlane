const { RichEmbed } = require('discord.js');
const { getChannel } = require('../../functions');

module.exports = {
	name: 'settings',
	aliases: ['set'],
	category: 'moderation',
	description: 'Allows you to set various server specific bot settings',
	run: async (client, message, args) => {
		if (!message.member.hasPermission('ADMINISTRATOR'))
			return message.channel
				.send(
					new RichEmbed()
						.setTitle('Settings Manager')
						.setColor(client.config.color.error)
						.setDescription('You do not have permission to change the bot settings on this server!')
				)
				.then(m => m.delete(client.config.liveTime));

		let embed = new RichEmbed().setColor(client.config.color.info).setTitle('Settings Manager');

		//If there's no arguments
		if (args.length === 0) {
			embed.setColor(client.config.color.error).setDescription('Please provide some arguments for the command');

			return message.channel.send(embed);
		}

		//Set Server Prefix
		if (args[0] === 'prefix') {
			args.shift();

			if (args.length === 0) {
				embed.setDescription(`The server prefix is ${client.foundGuild.prefix}`);

				message.channel.send(embed);
				return;
			}

			client.foundGuild.prefix = args[0];

			return client.foundGuild.save().then(message.channel.send(embed.setColor(client.config.color.success).setDescription(`The Guild prefix has been set to ${client.foundGuild.prefix}`)));
		}

		//Set Report Channel
		if (args[0] === 'reports' || args[0] === 'report') {
			args.shift();

			if (args.length === 0) {
				let value = 'not set';
				if (client.foundGuild.logChannels.reports) value = `<#${client.foundGuild.logChannels.reports}>`;
				embed.setDescription(`The Guild's report channel is ${value}`);

				return message.channel.send(embed);
			}

			if (args[0] === 'disable' || args[0] === 'disabled') {
				client.foundGuild.logChannels.reports = undefined;
				return client.foundGuild.save().then(message.channel.send(embed.setColor(client.config.color.success).setDescription(`The Guild reports channel has been disabled`)));
			}

			client.foundGuild.logChannels.reports = getChannel(message, args.join(' '));

			return client.foundGuild.save().then(message.channel.send(embed.setColor(client.config.color.success).setDescription(`The Guild reports channel has been set to <#${client.foundGuild.logChannels.reports}>`)));
		}

		//Set Mod log channel
		if (args[0] === 'modlog') {
			args.shift();

			if (args.length === 0) {
				let value = 'not set';
				if (client.foundGuild.logChannels.modLog) value = `<#${client.foundGuild.logChannels.modLog}>`;
				embed.setDescription(`The Guild's mod log channel is ${value}`);

				return message.channel.send(embed);
			}

			if (args[0] === 'disable' || args[0] === 'disabled') {
				client.foundGuild.logChannels.modLog = undefined;
				return client.foundGuild.save().then(message.channel.send(embed.setColor(client.config.color.success).setDescription(`The Guild mod log channel has been disabled`)));
			}

			client.foundGuild.logChannels.modLog = getChannel(message, args.join(' '));

			client.foundGuild.save().then(message.channel.send(embed.setColor(client.config.color.success).setDescription(`The mod log channel has been set to <#${client.foundGuild.logChannels.modLog}>`)));
		}
	}
};
