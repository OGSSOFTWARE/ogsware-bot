module.exports = {
  // ─── Bot ───────────────────────────────────────────────
  token: process.env.DISCORD_TOKEN || 'YOUR_BOT_TOKEN',
  clientId: process.env.CLIENT_ID || 'YOUR_CLIENT_ID',
  guildId: process.env.GUILD_ID || 'YOUR_GUILD_ID', // for guild-scoped slash commands

  // ─── Status ────────────────────────────────────────────
  status: {
    text: '⭐ ogsware.com',
    type: 'WATCHING', // PLAYING | WATCHING | LISTENING | STREAMING
  },

  // ─── Channels ──────────────────────────────────────────
  channels: {
    joinLog: '1339668114702602424',
    modLog: '1410320220693729400',
    vouches: '1339668114517917822',
    giveaways: '1409140037525835877',
    newUploads: '1493306797434339338', // TikTok / YouTube announcements
    sellAuthVouches: '1339668114517917822',
  },

  // ─── Crypto Wallets ────────────────────────────────────
  wallets: {
    bitcoin:  'bc1qjge8gk4t3g4q83jg0dnx8qn795mu3l8twv8y6n',
    litecoin: 'LWmUEY659C6P6531TvMmgFkNihprER49Vi',
    ethereum: '0xEf89499329eb78954B1d0D25121cA4dB46112587',
    solana:   'Bd7Z6DkjHNVaFvKtVg97CoLq6CrdMpD6jg2qBjVHKnEL',
  },

  // ─── Database ──────────────────────────────────────────
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://zubxky_db_user:pyetAN284f1dwdoJ@botdc.2vwxdkb.mongodb.net/?appName=BotDc',

  // ─── SellAuth ──────────────────────────────────────────
  sellAuth: {
    apiKey: process.env.SELLAUTH_API_KEY || 'YOUR_SELLAUTH_API_KEY',
    shopId: process.env.SELLAUTH_SHOP_ID || 'YOUR_SHOP_ID',
    pollInterval: 60_000, // ms — how often to check for new feedback
    logoUrl: 'https://media.discordapp.net/attachments/1490754874940325948/1490762334665314314/GIF.gif?ex=69e26b1d&is=69e1199d&hm=7c8fc1de6e06a86d3c2ec7df7e5e21be8511b5041ac615f7fac290ca04f89934&=&width=900&height=900', // ← replace with your actual SellAuth shop logo URL
  },

  // ─── YouTube ───────────────────────────────────────────
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY || 'YOUR_YOUTUBE_API_KEY',
    channelId: 'UCxOXQtItY1ugo4Pc0P0ZNxg',
    pollInterval: 60_000, // 5 minutes
  },

  // ─── TikTok ────────────────────────────────────────────
  tiktok: {
    username: 'ogs.ware',
    pollInterval: 300_000,
  },

  // ─── Embed defaults ────────────────────────────────────
  embedDefaults: {
    color: 0xFAD800,      // Discord blurple
    footerText: 'OGSWare |  All Rights Reserved.',
    footerIcon: 'https://media.discordapp.net/attachments/1490754874940325948/1490762334665314314/GIF.gif?ex=69e26b1d&is=69e1199d&hm=7c8fc1de6e06a86d3c2ec7df7e5e21be8511b5041ac615f7fac290ca04f89934&=&width=900&height=900',
    thumbnail: 'https://media.discordapp.net/attachments/1490754874940325948/1490762334665314314/GIF.gif?ex=69e26b1d&is=69e1199d&hm=7c8fc1de6e06a86d3c2ec7df7e5e21be8511b5041ac615f7fac290ca04f89934&=&width=900&height=900',
    bannerImage: 'https://media.discordapp.net/attachments/1490754874940325948/1491027116647518259/G23FX56.gif?ex=69e21036&is=69e0beb6&hm=226d2fee630e1307efc66244463e3f598333827af7bea4f87a6515ecc03ba8e2&=&width=495&height=175'
  },
};
