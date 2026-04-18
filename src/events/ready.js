const Invite = require('../database/models/invite');
const mongoose = require('mongoose');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`[BOT] Ready! Serving ${client.guilds.cache.size} guild(s).`);

    // Wait for MongoDB to be connected before running DB operations
    const waitForDB = () => new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) return resolve();
      mongoose.connection.once('connected', resolve);
    });

    await waitForDB();
    console.log('[DB] MongoDB ready — starting services...');

    // Restore giveaway timers
    try {
      const { checkGiveaways } = require('../services/giveawayService');
      await checkGiveaways(client);
    } catch (err) {
      console.error('[Giveaway] Error restoring timers:', err.message);
    }

    // Seed invites
    for (const [, guild] of client.guilds.cache) {
      try {
        const invites = await guild.invites.fetch();
        for (const [code, inv] of invites) {
          await Invite.findOneAndUpdate(
            { code },
            { userId: inv.inviter?.id || 'unknown', guildId: guild.id, code, uses: inv.uses },
            { upsert: true }
          );
        }
        console.log(`[Invites] Seeded ${invites.size} invite(s) for ${guild.name}`);
      } catch (err) {
        console.error(`[Invites] Error:`, err.message);
      }
    }
  },
};
