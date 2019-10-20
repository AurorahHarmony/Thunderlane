const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	xp: {
		type: Map,
		of: String
	}
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
