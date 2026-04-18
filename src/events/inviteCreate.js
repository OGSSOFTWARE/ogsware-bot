const Invite = require('../database/models/invite');

module.exports = {
  name: 'inviteCreate',
  async execute(invite) {
    await Invite.findOneAndUpdate(
      { code: invite.code },
      {
        userId:  invite.inviter?.id || 'unknown',
        guildId: invite.guild.id,
        code:    invite.code,
        uses:    invite.uses || 0,
      },
      { upsert: true, new: true }
    );
    console.log(`[Invites] Tracked new invite ${invite.code} by ${invite.inviter?.tag}`);
  },
};
