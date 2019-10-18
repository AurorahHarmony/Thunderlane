const { RichEmbed } = require('discord.js');

module.exports = {
	name: 'settings',
	aliases: ['set'],
	category: 'moderation',
	description: 'Allows you to set various server specific bot settings',
	run: async (client, message, args, foundGuild) => {
		if (!message.member.hasPermission('ADMINISTRATOR'))
			return message.channel
				.send(
					new RichEmbed()
						.setTitle('Settings Manager')
						.setColor(client.config.color.error)
						.setDescription('You do not have permission to change the bot settings on this server!')
				)
				.then(m => m.delete(client.config.liveTime));

		let embed = new RichEmbed().setTitle('Settings Manager');

		//If there's no arguments
		if (args.length === 0) {
			embed.setColor(client.config.color.error).setDescription('Please provied some arguments for the command');

			message.channel.send(embed);
		}

		//Set Server Prefix
		if (args[0] === 'prefix') {
			args.shift();

			if (args.length === 0) {
				embed.setColor(client.config.color.info).setDescription(`The server prefix is ${client.foundGuild.prefix}`);

				message.channel.send(embed);
				return;
			}

			client.foundGuild.prefix = args[0];

			client.foundGuild.save().then(message.channel.send(embed.setColor(client.config.color.success).setDescription(`The guild prefix has been set to ${client.foundGuild.prefix}`)));
		}
	}
};
