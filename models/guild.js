const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const guildSchema = new mongoose.Schema({
	guildID: { type: String, required: true },
	guildName: String,
	prefix: String,
	logChannels: {
		reports: String,
		modLog: String,
		joinLog: String,
		leaveLog: String,
		wordWhitelist: {
			channel: String,
			ignoredMembers: Array
		}
	}
});

guildSchema.plugin(findOrCreate);

module.exports = mongoose.model('Guild', guildSchema);
