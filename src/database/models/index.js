const mongoose = require('mongoose');

// ─── Role Memory ───────────────────────────────────────────────────────────
const roleMemorySchema = new mongoose.Schema({
  userId:  { type: String, required: true },
  guildId: { type: String, required: true },
  roles:   [String],
}, { timestamps: true });
roleMemorySchema.index({ userId: 1, guildId: 1 }, { unique: true });

// ─── Sticky Messages ───────────────────────────────────────────────────────
const stickySchema = new mongoose.Schema({
  channelId: { type: String, required: true, unique: true },
  guildId:   { type: String, required: true },
  message:   { type: String, required: true },
  lastMsgId: { type: String, default: null }, // ID of the last sticky bot posted
});

// ─── Giveaways ─────────────────────────────────────────────────────────────
const giveawaySchema = new mongoose.Schema({
  messageId:  { type: String, required: true, unique: true },
  channelId:  { type: String, required: true },
  guildId:    { type: String, required: true },
  prize:      { type: String, required: true },
  description:{ type: String, default: '' },
  winnerCount:{ type: Number, default: 1 },
  endsAt:     { type: Date,   required: true },
  hostId:     { type: String, required: true },
  ended:      { type: Boolean, default: false },
  winners:    [String],
});

// ─── Vouches ───────────────────────────────────────────────────────────────
const vouchSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  guildId:   { type: String, required: true },
  product:   { type: String, required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  review:    { type: String, required: true },
  source:    { type: String, default: 'manual' }, // 'manual' | 'sellauth'
  createdAt: { type: Date, default: Date.now },
});

// ─── SellAuth Tracking ─────────────────────────────────────────────────────
const sellAuthSchema = new mongoose.Schema({
  feedbackId: { type: String, required: true, unique: true },
  postedAt:   { type: Date, default: Date.now },
});

// ─── YouTube / TikTok Tracking ─────────────────────────────────────────────
const uploadTrackSchema = new mongoose.Schema({
  platform:  { type: String, required: true }, // 'youtube' | 'tiktok'
  videoId:   { type: String, required: true, unique: true },
  postedAt:  { type: Date, default: Date.now },
});

module.exports = {
  RoleMemory:   mongoose.model('RoleMemory',   roleMemorySchema),
  Sticky:       mongoose.model('Sticky',       stickySchema),
  Giveaway:     mongoose.model('Giveaway',     giveawaySchema),
  Vouch:        mongoose.model('Vouch',        vouchSchema),
  SellAuthLog:  mongoose.model('SellAuthLog',  sellAuthSchema),
  UploadTrack:  mongoose.model('UploadTrack',  uploadTrackSchema),
};
