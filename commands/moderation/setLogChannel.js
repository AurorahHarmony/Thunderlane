const { RichEmbed } = require('discord.js');
const { getChannel } = require('../../functions');

module.exports = {
	name: 'logchannel',
	category: 'moderation',
	description: 'Allows setup of log channel',
	run: async (client, message, args, foundGuild) => {
		let embed = new RichEmbed()
			.setTitle('Log Channel')
			.setColor(client.config.color.info)
			.setDescription('Pinging...');

		if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(embed.setColor(client.config.color.warning).setDescription('You do not have permission to change the log channel'));

		foundGuild.logChannel = getChannel(message, args.join(' '));

		foundGuild.save().then(message.channel.send(embed.setColor(client.config.color.success).setDescription(`The mod log channel has been set to <#${foundGuild.logChannel}>`)));
	}
};
