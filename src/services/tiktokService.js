/**
 * TikTok Upload Monitor
 * Uses proxitok.pussthecat.org as a free RSS bridge for TikTok
 * No API key needed, no self-hosting required.
 */
const RSSParser = require('rss-parser');
const config = require('../../config/config');
const embeds = require('../embeds/embeds');
const { UploadTrack } = require('../database/models');

const parser = new RSSParser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; RSSBot/1.0)',
  },
});

let poller = null;
let seeded = false;

// List of fallback RSS bridges to try in order
const getRssUrls = (username) => [
  'https://rss.app/feeds/34XxtFB6GLKinSNv.xml',
];

async function fetchFeed(username) {
  const urls = getRssUrls(username);
  for (const url of urls) {
    try {
      const feed = await parser.parseURL(url);
      if (feed && feed.items && feed.items.length > 0) {
        console.log(`[TikTok] Successfully fetched from: ${url}`);
        return feed.items;
      }
    } catch (err) {
      console.log(`[TikTok] Failed ${url}: ${err.message} — trying next...`);
    }
  }
  return null;
}

async function checkTikTok(client) {
  const { username } = config.tiktok;
  if (!username || username === 'your_tiktok_username') return;

  const items = await fetchFeed(username);

  if (!items) {
    console.error('[TikTok] All RSS bridges failed. Will retry next interval.');
    return;
  }

  // ── On first run: seed existing videos silently ──────────────────────────
  if (!seeded) {
    seeded = true;
    const existingCount = await UploadTrack.countDocuments({ platform: 'tiktok' });
    if (existingCount === 0 && items.length > 0) {
      const docs = items.map(item => ({
        platform: 'tiktok',
        videoId: item.guid || item.link,
      }));
      await UploadTrack.insertMany(docs, { ordered: false }).catch(() => null);
      console.log(`[TikTok] Seeded ${docs.length} existing videos — only NEW uploads will be posted.`);
      return;
    }
  }

  // ── Normal run: post only new videos ────────────────────────────────────
  for (const item of items) {
    const videoId = item.guid || item.link;
    if (!videoId) continue;

    const exists = await UploadTrack.findOne({ platform: 'tiktok', videoId });
    if (exists) continue;

    await UploadTrack.create({ platform: 'tiktok', videoId });

    // Extract thumbnail
    let thumbnailUrl = null;
    const content = item['content:encoded'] || item.content || '';
    const match = content.match(/src="([^"]+)"/);
    if (match) thumbnailUrl = match[1];

    const embed = embeds.newUpload({
      platform: 'TikTok',
      title: item.title || 'New TikTok Video',
      url: item.link,
      thumbnailUrl,
      channelName: `@${username}`,
    });

    const channel = client.channels.cache.get(config.channels.newUploads);
    if (channel) {
      await channel.send({
        content: `🎵 **New TikTok just dropped!** Go check it out: ${item.link}`,
        embeds: [embed],
      });
    }

    console.log(`[TikTok] Announced new video: ${item.title}`);
  }
}

module.exports = function startTikTokService(client) {
  if (poller) clearInterval(poller);
  checkTikTok(client);
  poller = setInterval(() => checkTikTok(client), config.tiktok.pollInterval);
  console.log('[TikTok] Upload monitor started.');
};
