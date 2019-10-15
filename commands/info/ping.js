const { RichEmbed } = require('discord.js');

module.exports = {
	name: 'ping',
	category: 'info',
	description: 'returns latency and API ping',
	run: async (client, message, args) => {
		let embed = new RichEmbed()
			.setTitle('Ping')
			.setColor(client.config.color.info)
			.setDescription('Pinging...');

		const msg = await message.channel.send(embed);

		embed.description = `Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms\nAPI Latency is ${Math.round(client.ping)}ms`;

		msg.edit(embed);
	}
};
