const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const guildSchema = new mongoose.Schema({
	guildID: { type: String, required: true },
	guildName: String,
	prefix: String,
	logChannels: {
		reports: {
			enabled: Boolean,
			channel: String
		},
		modLog: {
			enabled: Boolean,
			channel: String
		},
		joinLog: {
			enabled: Boolean,
			channel: String
		},
		leaveLog: {
			enabled: Boolean,
			channel: String
		},
		wordWhitelist: {
			enabled: Boolean,
			channel: String,
			ignoredMembers: Array
		}
	}
});

guildSchema.plugin(findOrCreate);

module.exports = mongoose.model('Guild', guildSchema);
