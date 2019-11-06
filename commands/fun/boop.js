const { getMember } = require('../../functions.js');

module.exports = {
	name: 'boop',
	category: 'fun',
	description: 'boops a server member',
	usage: '<id | mention>',
	run: async (client, message, args) => {
		if (!args[0]) {
			return message.channel.send('*Not a sound to be heard, no target to boop*');
		}

		const member = getMember(message, args.join(' '));

		if (!member) return message.channel.send("I can't find that user :<");

		if (member.id == message.client.user.id) return message.channel.send('I am unboopable :3c');

		if (message.deletable) {
			message.delete();
		}

		if (message.member.id == member.id) {
			return message.channel.send(`<@${message.member.id}> booped themself. How sad.`);
		}

		const messages = ['#toBoop was booped by #booper'];
		const append = ['How mean!', "Boop 'em back!", 'It was super effective!', 'It was not very effective...', 'But it had no effect.', 'Critical hit!', ':o', 'c:'];
		const appendIndex = Math.floor(Math.random() * append.length);

		output = `${messages[0]} ${append[appendIndex]}`;
		output = output.replace(/#booper/g, `<@${message.member.id}>`).replace(/#toBoop/g, `<@${member.id}>`);
		message.channel.send(output);
	}
};
