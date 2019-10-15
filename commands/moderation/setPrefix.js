const { RichEmbed } = require('discord.js');

module.exports = {
	name: 'setprefix',
	aliases: ['prefix'],
	category: 'moderation',
	description: 'allows you to change the server prefix',
	usage: '<input>',
	run: async (client, message, args, foundGuild) => {
		if (args.length === 0) {
			const embed = new RichEmbed()
				.setTitle('Prefix Manager')
				.setColor(client.config.color.info)
				.setDescription(`The server prefix is ${foundGuild.prefix}`);

			message.channel.send(embed);
			return;
		}

		if (!message.member.hasPermission('ADMINISTRATOR'))
			return message.channel.send(
				new RichEmbed()
					.setTitle('Prefix Manager')
					.setColor(client.config.color.warning)
					.setDescription('You do not have permission to change the server prefix')
			);

		foundGuild.prefix = args[0];

		foundGuild.save().then(
			message.channel.send(
				new RichEmbed()
					.setTitle('Prefix Manager')
					.setColor(client.config.color.success)
					.setDescription(`The prefix has been set to ${foundGuild.prefix}`)
			)
		);
	}
};
