const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { promptMessage } = require('../../functions.js');

module.exports = {
	name: 'ban',
	category: 'moderation',
	description: 'bans the member',
	usage: '<id | mention>',
	run: async (client, message, args) => {
		// No author permissions
		if (!message.member.hasPermission('BAN_MEMBERS')) {
			return message.reply('❌ You do not have permissions to ban members. Please contact a staff member').then(m => m.delete(client.config.liveTime));
		}
		// No bot permissions
		if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
			return message.reply('❌ I do not have permissions to ban members. Please contact a staff member').then(m => m.delete(client.config.liveTime));
		}

		let logChannel;

		if (client.foundGuild.logChannels.modLog) logChannel = client.foundGuild.logChannels.modLog;

		if (!logChannel)
			return message.channel.send(
				new RichEmbed()
					.setColor(client.config.color.error)
					.setTitle('Ban a User')
					.setDescription(stripIndents`Banning a user is disabled in ${message.guild.name} (${message.guild.id}). Please contact an Administrator to setup a mod log channel.`)
			);

		if (message.deletable) message.delete();

		// No args
		if (!args[0]) {
			return message.reply('Please provide a person to ban.').then(m => m.delete(client.config.liveTime));
		}

		// No reason
		if (!args[1]) {
			return message.reply('Please provide a reason to ban.').then(m => m.delete(client.config.liveTime));
		}

		const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);

		// No member found
		if (!toBan) {
			return message.reply("Couldn't find that member, try again").then(m => m.delete(client.config.liveTime));
		}

		// Can't ban urself
		if (toBan.id === message.author.id) {
			return message.reply("You can't ban yourself...").then(m => m.delete(client.config.liveTime));
		}

		// Check if the user's banable
		if (!toBan.bannable) {
			return message.reply("I can't kick that person due to role hierarchy").then(m => m.delete(client.config.liveTime));
		}

		const embed = new RichEmbed()
			.setColor(client.config.color.error)
			.setThumbnail(toBan.user.displayAvatarURL)
			.setFooter(message.member.displayName, message.author.displayAvatarURL)
			.setTimestamp().setDescription(stripIndents`**Banned member:** ${toBan} (${toBan.id})
            **Banned by:** ${message.member} (${message.member.id})
            **Reason:** ${args.slice(1).join(' ')}`);

		const promptEmbed = new RichEmbed()
			.setColor(client.config.color.warning)
			.setAuthor(`This verification will automatically cancel in 30s`)
			.setDescription(`Are you sure you want to **Ban**: ${toBan}?`);

		// Send the message
		await message.channel.send(promptEmbed).then(async msg => {
			// Await the reactions and the reactioncollector
			const emoji = await promptMessage(msg, message.author, 30, ['✅', '❌'], true);

			// Verification stuffs
			if (emoji === '✅') {
				msg.delete();

				toBan.ban(args.slice(1).join(' ')).catch(err => {
					if (err) return message.channel.send(`Ban Failed: ${err}`);
				});

				client.channels.get(logChannel).send(embed);
			} else if (emoji === '❌') {
				msg.delete();

				message.reply(`Ban Canceled`).then(m => m.delete(client.config.liveTime));
			}
		});
	}
};
