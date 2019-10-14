module.exports = {
	name: 'say',
	aliases: ['broadcast'],
	category: 'moderation',
	description: 'says your input via the bot',
	usage: '<input>',
	run: async (client, message, args) => {
		if (message.deletable) message.delete();

		if (args.length < 1) return message.reply('Your say command does not have any content').then(m => m.delete(5000));

		message.channel.send(args.join(''));
	}
};
