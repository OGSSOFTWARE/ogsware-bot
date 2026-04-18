const Invite = require('../database/models/invite');

module.exports = {
  name: 'inviteDelete',
  async execute(invite) {
    await Invite.findOneAndDelete({ code: invite.code });
  },
};
