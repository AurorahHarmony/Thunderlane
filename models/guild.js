const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const guildSchema = new mongoose.Schema({
	guildID: { type: String, required: true },
	prefix: String
});

guildSchema.plugin(findOrCreate);

module.exports = mongoose.model('Guild', guildSchema);