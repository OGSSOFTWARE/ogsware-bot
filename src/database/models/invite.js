const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  userId:   { type: String, required: true },
  guildId:  { type: String, required: true },
  code:     { type: String, required: true, unique: true },
  uses:     { type: Number, default: 0 },
  invitedUsers: [{ type: String }], // Discord IDs of users who joined via this invite
}, { timestamps: true });

inviteSchema.index({ userId: 1, guildId: 1 });

module.exports = mongoose.model('Invite', inviteSchema);
