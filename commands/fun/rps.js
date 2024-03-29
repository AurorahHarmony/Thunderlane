const { RichEmbed } = require('discord.js');
const { promptMessage } = require('../../functions.js');

const chooseArr = ['🗿', '📰', '✂'];

module.exports = {
	name: 'rps',
	category: 'fun',
	description: 'Rock Paper Scissors game. React to one of the emojis to play.',
	usage: 'rps',
	run: async (client, message, args) => {
		const embed = new RichEmbed()
			.setColor(client.config.color.info)
			.setTitle('Rock Paper Scissors')
			.setFooter(message.member.displayName, message.author.displayAvatarURL)
			.setDescription('Pick wisely. You have 30s.')
			.setTimestamp();

		const m = await message.channel.send(embed);
		// Wait for a reaction to be added
		const reacted = await promptMessage(m, message.author, 10, chooseArr);

		// Get a random emoji from the array
		const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

		// Check if it's a win/tie/loss
		const result = await getResult(reacted, botChoice);
		// Clear the reactions
		await m.clearReactions();

		embed
			.setDescription('')
			.setTitle('')
			.addField(result, `${reacted || 'Nothing'} vs ${botChoice}`);

		m.edit(embed);

		function getResult(me, clientChosen) {
			if ((me === '🗿' && clientChosen === '✂') || (me === '📰' && clientChosen === '🗿') || (me === '✂' && clientChosen === '📰')) {
				return `${message.member.displayName} Won!`;
			} else if (me === clientChosen) {
				return "It's a tie!";
			} else {
				return `${message.member.displayName} lost!`;
			}
		}
	}
};
