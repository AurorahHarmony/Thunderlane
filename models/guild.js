const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const guildSchema = new mongoose.Schema({
	guildID: { type: String, required: true },
	guildName: String,
	prefix: String,
	logChannels: {
		reports: {
			enabled: { type: Boolean, default: false },
			channel: String
		},
		modLog: {
			enabled: { type: Boolean, default: false },
			channel: String
		},
		joinLog: {
			enabled: { type: Boolean, default: false },
			channel: String
		},
		leaveLog: {
			enabled: { type: Boolean, default: false },
			channel: String
		},
		wordWhitelist: {
			enabled: { type: Boolean, default: false },
			channel: String,
			ignoredMembers: Array
		}
	}
});

guildSchema.plugin(findOrCreate);

module.exports = mongoose.model('Guild', guildSchema);
