const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = {
	name: 'report',
	category: 'moderation',
	description: 'Reports a member',
	usage: '<mention> | <id>',
	run: async (client, message, args) => {
		if (message.deletable) message.delete();

		let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

		if (!rMember) return message.reply('Couldnt find that person').then(m => m.delete(client.config.liveTime));

		if (rMember.hasPermission('BAN_MEMBERS') || rMember.user.bot) return message.reply('Cannot report that member').then(m => m.delete(client.config.liveTime));

		if (!args[1]) return message.channel.send('Please provide a reason for the report').then(m => m.delete(client.config.liveTime));

		let channel;
		if (client.foundGuild.logChannels.reports.enabled) channel = client.foundGuild.logChannels.reports.channel;

		if (!channel) return message.channel.send('I could not find the log channel').then(m => m.delete(client.config.liveTime));

		const embed = new RichEmbed()
			.setColor(client.config.color.error)
			.setTimestamp()
			.setFooter(message.guild.name, message.guild.iconURL)
			.setAuthor('Reported Member', rMember.user.displayAvatarURL).setDescription(stripIndents`**Member:** ${rMember} (${rMember.id})
      **Reported By:** ${message.member} (${message.member.id})
      **Reported In:** ${message.channel}
      **Reason:** ${args.slice(1).join(' ')}`);

		client.channels.get(channel).send(embed);
		message.author.send(`You have reported a member in ${message.guild.name} (${message.guild.id})`);
		return message.author.send(embed);
	}
};
