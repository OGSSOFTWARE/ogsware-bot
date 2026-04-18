const { Giveaway } = require('../database/models');

async function checkGiveaways(client) {
  const active = await Giveaway.find({ ended: false });
  if (!active.length) return;

  console.log(`[Giveaway] Restoring ${active.length} active giveaway(s)...`);
  const giveawayCmd = require('../commands/slash/creategiveaway');

  for (const giveaway of active) {
    await giveawayCmd.restoreTimer(giveaway, client);
  }
}

module.exports = { checkGiveaways };
