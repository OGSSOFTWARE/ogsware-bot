const Invite = require('../database/models/invite');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`[BOT] Ready! Serving ${client.guilds.cache.size} guild(s).`);

    // Restore active giveaway timers on restart
    const { checkGiveaways } = require('../services/giveawayService');
    checkGiveaways(client);

    // Seed all existing invites so we can detect changes on member join
    for (const [, guild] of client.guilds.cache) {
      try {
        const invites = await guild.invites.fetch();
        for (const [code, inv] of invites) {
          await Invite.findOneAndUpdate(
            { code },
            {
              userId:  inv.inviter?.id || 'unknown',
              guildId: guild.id,
              code,
              uses:    inv.uses,
            },
            { upsert: true }
          );
        }
        console.log(`[Invites] Seeded ${invites.size} invite(s) for ${guild.name}`);
      } catch (err) {
        console.error(`[Invites] Could not fetch invites for ${guild.name}:`, err.message);
      }
    }
  },
};
