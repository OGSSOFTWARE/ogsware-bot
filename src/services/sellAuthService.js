const axios = require('axios');
const config = require('../../config/config');
const embeds = require('../embeds/embeds');
const { SellAuthLog, Vouch } = require('../database/models');

let poller = null;
let seeded = false;

async function checkSellAuth(client) {
  const { apiKey, shopId } = config.sellAuth;
  if (!apiKey || apiKey === 'YOUR_SELLAUTH_API_KEY') return;

  try {
    const res = await axios.get(`https://api.sellauth.com/v1/shops/${shopId}/feedbacks`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      params: { limit: 50 },
    });

    const feedbacks = res.data?.data || res.data || [];

    // ── On first run: silently mark ALL existing reviews as seen ─────────────
    if (!seeded) {
      seeded = true;
      const existingCount = await SellAuthLog.countDocuments();
      if (existingCount === 0 && feedbacks.length > 0) {
        const docs = feedbacks.map(fb => ({ feedbackId: String(fb.id) }));
        await SellAuthLog.insertMany(docs, { ordered: false }).catch(() => null);
        console.log(`[SellAuth] Seeded ${docs.length} existing reviews — will only post NEW ones from now on.`);
        return;
      }
    }

    // ── Normal run: only process reviews we haven't seen ────────────────────
    for (const fb of feedbacks) {
      const feedbackId = String(fb.id);

      const exists = await SellAuthLog.findOne({ feedbackId });
      if (exists) continue;

      await SellAuthLog.create({ feedbackId });

      const userId = fb.discord_id || fb.customer?.discord_id || null;
      const rating = fb.rating || 5;
      const review = fb.message || fb.comment || '';

      await Vouch.create({
        userId: userId || 'unknown',
        guildId: config.guildId,
        product: fb.product?.title || 'SellAuth Product',
        rating,
        review,
        source: 'sellauth',
      });

      // Post vouch embed
      const vouchChannel = client.channels.cache.get(config.channels.sellAuthVouches);
      const embed = embeds.vouchEmbed({ userId, product, rating, review, source: 'sellauth' });
      if (vouchChannel) {
        await vouchChannel.send({ embeds: [embed] });
      }

      // DM user if Discord linked
      if (userId) {
        const discordUser = await client.users.fetch(userId).catch(() => null);
        if (discordUser) {
          const dmEmbed = embeds.vouchDM({ rating, review });
          await discordUser.send({ embeds: [dmEmbed] }).catch(() => null);
        }
      }

      console.log(`[SellAuth] Posted new feedback ID ${feedbackId}`);
    }
  } catch (err) {
    console.error('[SellAuth] Error polling feedback:', err.message);
  }
}

module.exports = function startSellAuthService(client) {
  if (poller) clearInterval(poller);
  checkSellAuth(client);
  poller = setInterval(() => checkSellAuth(client), config.sellAuth.pollInterval);
  console.log('[SellAuth] Feedback monitor started.');
};
