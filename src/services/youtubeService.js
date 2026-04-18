const axios = require('axios');
const config = require('../../config/config');
const embeds = require('../embeds/embeds');
const { UploadTrack } = require('../database/models');

let poller = null;

async function checkYouTube(client) {
  const { apiKey, channelId } = config.youtube;
  if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY') return;

  try {
    const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: apiKey,
        channelId,
        part: 'snippet',
        order: 'date',
        maxResults: 5,
        type: 'video',
      },
    });

    const items = res.data.items || [];

    for (const item of items) {
      const videoId = item.id.videoId;
      if (!videoId) continue;

      const exists = await UploadTrack.findOne({ platform: 'youtube', videoId });
      if (exists) continue;

      // New upload detected
      await UploadTrack.create({ platform: 'youtube', videoId });

      const snippet = item.snippet;
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      const embed = embeds.newUpload({
        platform: 'YouTube',
        title: snippet.title,
        url,
        thumbnailUrl: snippet.thumbnails?.high?.url,
        channelName: snippet.channelTitle,
      });

      const channel = client.channels.cache.get(config.channels.newUploads);
      if (channel) {
        await channel.send({
          content: `🎬 **New YouTube Video!** Check it out: ${url}`,
          embeds: [embed],
        });
      }

      console.log(`[YouTube] Announced new video: ${snippet.title}`);
    }
  } catch (err) {
    console.error('[YouTube] Error checking uploads:', err.message);
  }
}

module.exports = function startYouTubeService(client) {
  if (poller) clearInterval(poller);

  // Run immediately then on interval
  checkYouTube(client);
  poller = setInterval(() => checkYouTube(client), config.youtube.pollInterval);
  console.log('[YouTube] Upload monitor started.');
};
