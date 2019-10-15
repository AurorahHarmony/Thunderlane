module.exports = {
	name: 'check',
	category: 'moderation',
	description: 'checks whether a user is a server admin',
	usage: '<input>',
	run: async (client, message, args, foundGuild) => {
		if (message.member.hasPermission('ADMINISTRATOR')) {
			message.channel.send('This user is an administrator');
		} else {
			message.channel.send('This user is not administrator');
		}
	}
};
