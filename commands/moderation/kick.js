const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { promptMessage } = require('../../functions.js');

module.exports = {
	name: 'kick',
	category: 'moderation',
	description: 'Kicks the member',
	usage: '<id | mention>',
	run: async (client, message, args) => {
		// No author permissions
		if (!message.member.hasPermission('KICK_MEMBERS')) {
			return message.reply('❌ You do not have permissions to kick members. Please contact a staff member').then(m => m.delete(client.config.liveTime));
		}

		// No bot permissions
		if (!message.guild.me.hasPermission('KICK_MEMBERS')) {
			return message.reply('❌ I do not have permissions to kick members. Please contact a staff member').then(m => m.delete(client.config.liveTime));
		}

		let logChannel;

		if (client.foundGuild.logChannels.modLog) logChannel = client.foundGuild.logChannels.modLog;

		if (!logChannel)
			return message.channel.send(
				new RichEmbed()
					.setColor(client.config.color.error)
					.setTitle('Kick a User')
					.setDescription(stripIndents`Kicking a user is disabled in ${message.guild.name} (${message.guild.id}). Please contact an Administrator to setup a mod log channel.`)
			);

		if (message.deletable) message.delete();

		// No args
		if (!args[0]) {
			return message.reply('Please provide a person to kick.').then(m => m.delete(client.config.liveTime));
		}

		// No reason
		if (!args[1]) {
			return message.reply('Please provide a reason to kick.').then(m => m.delete(client.config.liveTime));
		}

		const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);

		// No member found
		if (!toKick) {
			return message.reply("Couldn't find that member, try again").then(m => m.delete(client.config.liveTime));
		}

		// Can't kick urself
		if (toKick.id === message.author.id) {
			return message.reply("You can't kick yourself.").then(m => m.delete(client.config.liveTime));
		}

		// Check if the user's kickable
		if (!toKick.kickable) {
			return message.reply("I can't kick that person due to role hierarchy").then(m => m.delete(client.config.liveTime));
		}

		const embed = new RichEmbed()
			.setColor(client.config.color.warning)
			.setThumbnail(toKick.user.displayAvatarURL)
			.setFooter(message.member.displayName, message.author.displayAvatarURL)
			.setTimestamp().setDescription(stripIndents`**Kicked member:** ${toKick} (${toKick.id})
            **Kicked by:** ${message.member} (${message.member.id})
            **Reason:** ${args.slice(1).join(' ')}`);

		const promptEmbed = new RichEmbed()
			.setColor(client.config.color.warning)
			.setAuthor(`This verification will automatically expire in 30s`)
			.setDescription(`Are you sure you want to **Kick**: ${toKick}?`);

		// Send the message
		await message.channel.send(promptEmbed).then(async msg => {
			// Await the reactions and the reaction collector
			const emoji = await promptMessage(msg, message.author, 30, ['✅', '❌'], true);

			// The verification stuffs
			if (emoji === '✅') {
				msg.delete();

				toKick.kick(args.slice(1).join(' ')).catch(err => {
					if (err) return message.channel.send(`Kick Failed: ${err}`);
				});

				client.channels.get(logChannel).send(embed);
			} else if (emoji === '❌') {
				msg.delete();

				message.reply(`Kick canceled.`).then(m => m.delete(client.config.liveTime));
			}
		});
	}
};
