const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const softBanSchema = new mongoose.Schema({
	userID: String,
	unbanTime: Number,
	bannedTime: Number
});

const guildSchema = new mongoose.Schema({
	guildID: { type: String, required: true },
	guildName: String,
	prefix: String,
	logChannels: {
		reports: String,
		modLog: String,
		joinLog: String,
		leaveLog: String,
		welcomeMsg: {
			channel: String,
			message: String
		},
		wordWhitelist: {
			channel: String,
			ignoredMembers: Array
		}
	},
	softBans: [softBanSchema]
});

guildSchema.plugin(findOrCreate);

module.exports = mongoose.model('Guild', guildSchema);
