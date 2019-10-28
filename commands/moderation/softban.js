const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { promptMessage, getUnixTime, parseDateString, furtherInputMessage, secondsToString } = require('../../functions.js');

module.exports = {
	name: 'softban',
	category: 'moderation',
	description: 'softbans the member',
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
					.setTitle('SoftBan a User')
					.setDescription(stripIndents`SoftBanning a user is disabled in ${message.guild.name} (${message.guild.id}). Please contact an Administrator to setup a mod log channel.`)
			);
		// if (message.deletable) message.delete();
		// No args
		if (!args[0]) {
			return message.reply('Please provide a person to softban.').then(m => m.delete(client.config.liveTime));
		}
		// No reason
		if (!args[1]) {
			return message.reply('Please provide a reason to softban.').then(m => m.delete(client.config.liveTime));
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
			return message.reply("I can't soft ban that person due to role hierarchy").then(m => m.delete(client.config.liveTime));
		}
		await message.channel.send(`How long would you like to softban ${toBan} for?`).then(async msg => {
			const response = await furtherInputMessage(msg, message.author, 30);
			const currentTime = getUnixTime();
			const secondsToBan = parseDateString(response);
			const unbanTime = currentTime + secondsToBan;
			const unbanDate = new Date(unbanTime * 1000);
			const unbanHourString = unbanDate.getUTCHours() < 10 ? '0' + unbanDate.getUTCHours() : unbanDate.getUTCHours();
			const unbanMinuteString = unbanDate.getUTCMinutes() < 10 ? '0' + unbanDate.getUTCMinutes() : unbanDate.getUTCMinutes();
			const promptEmbed = new RichEmbed().setColor(client.config.color.warning).setAuthor(`This verification will automatically cancel in 30s`).setDescription(stripIndents`Are you sure you want to **Soft Ban**: ${toBan}?
				The user will be unbanned on ${unbanDate.getUTCDate()}/${unbanDate.getUTCMonth() + 1}/${unbanDate.getUTCFullYear()} at ${unbanHourString}:${unbanMinuteString} UTC
				Which is in ${secondsToString(secondsToBan)}`);

			let notificationEmbed = new RichEmbed()
				.setColor(client.config.color.bot)
				.setThumbnail(toBan.user.displayAvatarURL)
				.setFooter(message.member.displayName, message.author.displayAvatarURL)
				.setTimestamp().setDescription(stripIndents`**SoftBanned Member:** ${toBan} (${toBan.id})
            **SoftBanned by:** ${message.member} (${message.member.id})
						**Reason:** ${args.slice(1).join(' ')}
						**Ban Length:** ${secondsToString(secondsToBan)}
						**Ends On:** ${unbanDate.getUTCDate()}/${unbanDate.getUTCMonth() + 1}/${unbanDate.getUTCFullYear()} at ${unbanHourString}:${unbanMinuteString} UTC`);

			// Send the message
			await message.channel.send(promptEmbed).then(async msg => {
				// Await the reactions and the reactioncollector
				const emoji = await promptMessage(msg, message.author, 30, ['✅', '❌'], true);
				// Verification stuffs
				if (emoji === '✅') {
					msg.delete();

					let toSoftBan = {
						userID: toBan,
						unbanTime: unbanTime,
						bannedTime: currentTime
					};

					let softBanIndex = await client.foundGuild.softBans.findIndex(current => current.userID == toSoftBan.userID);

					console.log(softBanIndex);

					if (softBanIndex === -1) {
						client.foundGuild.softBans.push(toSoftBan);
					} else {
						notificationEmbed.setDescription(notificationEmbed.description + `\n*\`updated from old softban made ${secondsToString(currentTime - client.foundGuild.softBans[softBanIndex].bannedTime)}\` ago*`);
						client.foundGuild.softBans[softBanIndex] = toSoftBan;
					}

					client.foundGuild.save();

					// toBan.ban(args.slice(1).join(' ')).catch(err => {
					// 	if (err) return message.channel.send(`Ban Failed: ${err}`);
					// });
					client.channels.get(logChannel).send(notificationEmbed);
				} else if (emoji === '❌') {
					msg.delete();
					message.reply(`Soft Ban Canceled`).then(m => m.delete(client.config.liveTime));
				}
			});
		});
	}
};
