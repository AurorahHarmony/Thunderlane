const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { promptMessage, getUnixTime, parseDateString, furtherInputMessage, secondsToString } = require('../../functions.js');

module.exports = {
	name: 't',
	category: 'moderation',
	description: 'softbans the member',
	usage: '<id | mention>',
	run: async (client, message, args) => {}
};
