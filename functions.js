module.exports = {
	getMember: function(message, toFind = '') {
		toFind = toFind.toLowerCase();

		let target = message.guild.members.get(toFind);

		if (!target && message.mentions.members) target = message.mentions.members.first();

		if (!target && toFind) {
			target = message.guild.members.find(member => {
				return member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind);
			});
		}

		if (!target) target = message.member;

		return target;
	},

	formatDate: function(date) {
		return new Intl.DateTimeFormat('en-US').format(date);
	},

	getChannel: function(message, toFind = '') {
		toFind = toFind.toLowerCase();

		let target;

		if (!target && typeof message.mentions.channels.first() !== 'undefined') target = message.mentions.channels.first().id;

		if (!target) target = message.channel.id;

		return target;
	},

	promptMessage: async function(message, author, time, validReactions, autoDelete) {
		time *= 1000;

		for (const reaction of validReactions) await message.react(reaction);

		const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

		if (autoDelete) {
			setTimeout(() => {
				if (message.deletable) message.delete();
			}, time + 100);
		}

		return message.awaitReactions(filter, { max: 1, time: time }).then(collected => collected.first() && collected.first().emoji.name);
	},

	furtherInputMessage: function(message, author, time) {
		time *= 1000;

		const filter = m => m.author.id === author.id;

		return message.channel.awaitMessages(filter, { max: 1, time: time }).then(collected => collected.first().content);
	},

	getUnixTime: function() {
		return Math.floor(Date.now() / 1000);
	},

	parseDateString: function(str) {
		let seconds = 0;
		let months = str.match(/(\d+)\s*M/);
		let days = str.match(/(\d+)\s*d/);
		let hours = str.match(/(\d+)\s*h/);
		let minutes = str.match(/(\d+)\s*m/);
		if (months) {
			seconds += parseInt(months[1]) * 2629746;
		}
		if (days) {
			seconds += parseInt(days[1]) * 86400;
		}
		if (hours) {
			seconds += parseInt(hours[1]) * 3600;
		}
		if (minutes) {
			seconds += parseInt(minutes[1]) * 60;
		}
		return seconds;
	},

	secondsToString: function(seconds) {
		let months = Math.floor(seconds / 2629746);
		seconds %= 2629746;
		let days = Math.floor(seconds / 86400);
		seconds %= 86400;
		let hours = Math.floor(seconds / 3600);
		seconds %= 3600;
		let minutes = Math.floor(seconds / 60);

		return `${months} Month(s), ${days} Day(s), ${hours} Hour(s), ${minutes} Minute(s)`;
	}
};
