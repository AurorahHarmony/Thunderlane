const { RichEmbed } = require('discord.js');

module.exports = {
	name: 'invite',
	category: 'bot',
	description: 'Returns a link to invite the bot to your server',
	run: async (client, message, args) => {
		let embed = new RichEmbed()
			.setTitle("Here's the link!")
			.setColor(client.config.color.bot)
			.setDescription(`[Invite ${message.client.user.username} to your server](https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=8)`);

		message.channel.send(embed);
	}
};
