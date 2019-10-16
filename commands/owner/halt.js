const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { promptMessage } = require('../../functions.js');

module.exports = {
	name: 'halt',
	category: 'owner',
	description: 'Kills the bot instance',
	run: async (client, message, args) => {
		// No author permissions
		if (message.member.id !== process.env.OWNER_ID) {
			return;
		}

		if (message.deletable) message.delete();

		const promptEmbed = new RichEmbed()
			.setColor(client.config.color.warning)
			.setAuthor(`This verification will automatically cancel in 10s`)
			.setDescription(`Are you sure you want to kill the bot?`);

		await message.channel.send(promptEmbed).then(async msg => {
			const emoji = await promptMessage(msg, message.author, 10, ['✅', '❌']);

			// Verification stuffs
			if (emoji === '✅') {
				await msg.delete();

				process.exit(0).catch(err => {
					if (err) return message.channel.send(`Kill Failed: ${err}`);
				});

				logChannel.send(embed);
			} else if (emoji === '❌') {
				msg.delete();

				message.reply(`Halt Canceled`).then(m => m.delete(client.config.liveTime));
			}
		});
	}
};
