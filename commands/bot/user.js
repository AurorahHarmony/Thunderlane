const { RichEmbed } = require('discord.js');

module.exports = {
	name: 'user',
	aliases: ['u'],
	category: 'bot',
	description: 'Test Command',
	run: async (client, message, args) => {
		// console.log(client.foundGuild);

		client.foundUser.doc.xp.set(client.foundGuild.guildID, 5);

		// console.log(client.foundUser.doc);
		client.foundUser.doc.save();

		let totalXP = 0;
		client.foundUser.doc.xp.forEach(e => {
			totalXP = parseInt(totalXP) + parseInt(e);
		});

		console.log(`XP earnt in this guild: ${client.foundUser.doc.xp.get(client.foundGuild.guildID)} Total: ${totalXP}`);
	}
};
