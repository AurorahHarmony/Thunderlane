module.exports = {
	name: 'setprefix',
	aliases: ['prefix'],
	category: 'moderation',
	description: 'allows you to change the server prefix',
	usage: '<input>',
	run: async (client, message, args, foundGuild) => {
		message.channel.send(JSON.toString(foundGuild));

		// Guild.findOne();
		console.log(foundGuild);
	}
};
