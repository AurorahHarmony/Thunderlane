const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { promptMessage, getUnixTime, parseDateString, furtherInputMessage, secondsToString } = require('../../functions.js');

module.exports = {
	name: 't',
	category: 'moderation',
	description: 'softbans the member',
	usage: '<id | mention>',
	run: async (client, message, args) => {
		let toSoftBan = {
			userID: message.author.id,
			unbanTime: getUnixTime() + 100,
			bannedTime: getUnixTime()
		};

		let softBanIndex = client.foundGuild.softBans.findIndex(current => current.userID === toSoftBan.userID);

		if (softBanIndex === -1) {
			client.foundGuild.softBans.push(toSoftBan);
		} else {
			client.foundGuild.softBans[softBanIndex] = toSoftBan;
		}

		console.log(client.foundGuild.softBans);

		// client.foundGuild.save();
		// console.log(client.foundGuild.softBans);

		// console.log(client.foundGuild.softBans.find(usr => usr.userID === '433558945873788928' || usr.userID === `<@${toBan}>`));
		// console.log(client.foundGuild.softBans.indexOf(usr => usr.userID === '373931417563824100'));
		// console.log(client.foundGuild);
		// client.foundGuild.doc.xp.set(client.foundGuild.guildID, 5);
	}
};
