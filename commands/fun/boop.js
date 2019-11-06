const { getMember } = require('../../functions.js');

module.exports = {
	name: 'boop',
	category: 'fun',
	description: 'boops a member',
	usage: '<id | mention>',
	run: async (client, message, args) => {
		if (!args[0]) {
			return message.channel.send('*Not a sound to be heard, no target to boop*');
		}

		const member = getMember(message, args.join(' '));

		if (!member) return message.channel.send("I can't find that user :<");

		if (member.id == message.client.user.id) return message.channel.send('I am unboopable :3c');

		const messages = ['#toBoop has been booped by #booper'];

		output = messages[0].replace(/#booper/g, `<@${message.member.id}>`).replace(/#toBoop/g, `<@${member.id}>`);
		if (message.deletable) {
			message.delete();
		}
		message.channel.send(output);
	}
};
