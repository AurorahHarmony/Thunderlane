const { getChannel } = require('../../functions');
const { RichEmbed } = require('discord.js');

module.exports = {
	name: 'say',
	aliases: ['broadcast', 'bc'],
	category: 'moderation',
	description: 'says your input via the bot',
	usage: '<input>',
	run: async (client, message, args) => {
		if (args.length < 1) return message.reply('Your say command does not have any content').then(m => m.delete(5000));

		let channelId = getChannel(message, args[0]);

		if (channelId === message.channel.id) {
			if (message.deletable) message.delete();
			message.channel.send(args.join(' '));
		} else {
			args.shift();

			client.channels.get(channelId).send(args.join(' '));
			message.channel.send(
				new RichEmbed()
					.setTitle('Messenger')
					.setColor(client.config.color.success)
					.setDescription(`Your message \`${args.join(' ')}\` was sent in <#${channelId}>`)
			);
		}

		// if (typeof message.mentions.channels.first() !== 'undefined') {
		// 	message.mentions.channels.first().send(args.join(' '));
		// 	message.channel.send('Message sent in ' + message.mentions.channels.first().name);
		// } else {
		// 	if (message.deletable) message.delete();
		// 	message.channel.send(args.join(' '));
		// }
	}
};
