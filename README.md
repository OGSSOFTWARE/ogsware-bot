# 🤖 OGSware Discord Bot

A fully-featured Discord bot for the OGSware server, built with **discord.js v14**, **MongoDB**, and a clean modular architecture.

---

## 📁 Project Structure

```
ogsware-bot/
├── config/
│   └── config.js              # All config: tokens, channels, wallets, etc.
├── src/
│   ├── index.js               # Entry point
│   ├── deploy-commands.js     # Slash command deployer
│   ├── commands/
│   │   ├── prefix/            # (reserved for future prefix-only commands)
│   │   └── slash/
│   │       ├── ban.js
│   │       ├── unban.js
│   │       ├── kick.js
│   │       ├── timeout.js
│   │       ├── untimeout.js
│   │       ├── addrole.js
│   │       ├── removerole.js
│   │       ├── nuke.js
│   │       ├── creategiveaway.js
│   │       ├── stickymessage.js
│   │       └── createvouch.js
│   ├── events/
│   │   ├── ready.js
│   │   ├── messageCreate.js
│   │   ├── interactionCreate.js
│   │   ├── guildMemberAdd.js
│   │   └── guildMemberRemove.js
│   ├── embeds/
│   │   └── embeds.js          # All embed templates
│   ├── database/
│   │   └── models/
│   │       └── index.js       # All Mongoose models
│   ├── services/
│   │   ├── giveawayService.js
│   │   ├── youtubeService.js
│   │   ├── tiktokService.js
│   │   └── sellAuthService.js
│   └── utils/
│       └── qrGenerator.js     # Crypto QR code generator
├── .env.example
├── package.json
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites

- **Node.js v18+** — https://nodejs.org
- **MongoDB** — https://www.mongodb.com/try/download/community (or use MongoDB Atlas for free cloud hosting)
- A **Discord Application** with a bot user — https://discord.com/developers/applications

### 2. Clone & Install

```bash
git clone https://github.com/yourrepo/ogsware-bot
cd ogsware-bot
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DISCORD_TOKEN=your_discord_bot_token
CLIENT_ID=your_application_client_id
GUILD_ID=your_guild_id
MONGO_URI=mongodb://localhost:27017/ogsware
SELLAUTH_API_KEY=your_sellauth_api_key
SELLAUTH_SHOP_ID=your_sellauth_shop_id
YOUTUBE_API_KEY=your_youtube_data_api_v3_key
```

### 4. Configure the Bot

Open `config/config.js` and fill in:

- **channels** — All Discord channel IDs (right-click → Copy ID in Discord)
- **wallets** — Your actual crypto wallet addresses
- **youtube.channelId** — Your YouTube channel ID
- **tiktok.username** — Your TikTok username (without @)
- **embedDefaults** — Your branding: colors, footer text, logo URL

### 5. Deploy Slash Commands

This registers all `/` commands with Discord (run once, or after adding new commands):

```bash
npm run deploy
```

### 6. Start the Bot

```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

---

## 🔧 Discord Bot Setup

### Required Bot Permissions

When inviting your bot, ensure it has:
- `Administrator` (simplest) — **or** individual permissions:
  - `Manage Roles`
  - `Manage Channels`
  - `Ban Members`
  - `Kick Members`
  - `Moderate Members`
  - `Manage Messages`
  - `Send Messages`
  - `Embed Links`
  - `Attach Files`
  - `Read Message History`
  - `Add Reactions`
  - `View Channels`

### Required Privileged Intents

In the Discord Developer Portal → Your App → Bot:
- ✅ **Server Members Intent**
- ✅ **Message Content Intent**

---

## 🎮 Features

### Prefix Commands (`!`)

| Command | Description |
|---------|-------------|
| `!PayPal` | Shows PayPal payment embed |
| `!Bitcoin` | Shows BTC wallet + QR code |
| `!Litecoin` | Shows LTC wallet + QR code |
| `!Ethereum` | Shows ETH wallet + QR code |
| `!Solana` | Shows SOL wallet + QR code |
| `!Card` | Shows card payment info |
| `!Reselling` | Shows reselling info |
| `!Promoter` | Shows promoter program info |
| `!Staff` | Shows staff application info |
| `!vouch` | Shows how to leave a vouch |
| `!Downloads` | Shows download instructions |
| `!Website` | Shows website link |
| `!Guides` | Shows guides/docs links |
| `!Status` | Shows service status |

> **Note:** Commands are case-insensitive. `!bitcoin`, `!Bitcoin`, `!BITCOIN` all work.

### Slash Commands (`/`)

| Command | Description | Permission |
|---------|-------------|------------|
| `/creategiveaway` | Create a giveaway with duration, prize, winners | Manage Events |
| `/stickymessage set` | Set a sticky message in a channel | Manage Messages |
| `/stickymessage remove` | Remove the sticky message | Manage Messages |
| `/createvouch` | Submit a vouch via modal | Everyone |
| `/ban` | Ban a member | Ban Members |
| `/unban` | Unban a user by ID | Ban Members |
| `/kick` | Kick a member | Kick Members |
| `/timeout` | Timeout a member (1 min – 28 days) | Moderate Members |
| `/untimeout` | Remove a timeout | Moderate Members |
| `/addrole` | Add a role to a member | Manage Roles |
| `/removerole` | Remove a role from a member | Manage Roles |
| `/nuke` | Clone + delete current channel | Manage Channels |

---

## 🔑 API Keys Setup

### YouTube Data API v3
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable **YouTube Data API v3**
4. Create credentials → API Key
5. Add key to `.env` as `YOUTUBE_API_KEY`
6. Add your channel ID to `config/config.js` → `youtube.channelId`

> Find your channel ID: go to your channel, click the URL. It's in the format `UCxxxxxxxx`. If you have a custom URL, use https://www.youtube.com/account_advanced.

### SellAuth API
1. Log in to your SellAuth dashboard
2. Go to Settings → API
3. Generate an API key
4. Add to `.env` as `SELLAUTH_API_KEY` and set `SELLAUTH_SHOP_ID`

### TikTok (RSS via RSSHub)
- No API key needed — uses RSSHub's free public instance
- For production, **self-host RSSHub**: https://github.com/DIYgod/RSSHub
- Or use a Pipedream workflow to send webhooks when you post

### MongoDB Atlas (Free Cloud DB)
1. Create account at https://www.mongodb.com/atlas
2. Create a free M0 cluster
3. Whitelist all IPs (`0.0.0.0/0`) or your server IP
4. Create a database user
5. Copy connection string to `MONGO_URI` in `.env`

---

## 🎨 Customizing Embeds

All embeds are in `src/embeds/embeds.js`. Each embed is a function you can edit:

```js
paypal: () =>
  base()
    .setTitle('💳 PayPal Payment')          // ← Change title
    .setDescription('...')                   // ← Change description
    .setColor(0x003087)                      // ← Change color (hex)
    .setThumbnail('https://...')            // ← Change thumbnail
    .setImage('https://...')               // ← Add banner image
    .addFields({ name: 'Label', value: 'Content' }) // ← Add fields
```

Global branding (footer, thumbnail) is in `config/config.js` → `embedDefaults`.

---

## 🗄️ Database Models

| Model | Purpose |
|-------|---------|
| `RoleMemory` | Stores user roles on leave, restores on rejoin |
| `Sticky` | Stores sticky messages per channel |
| `Giveaway` | Tracks active and ended giveaways |
| `Vouch` | Stores all manual + SellAuth vouches |
| `SellAuthLog` | Tracks processed SellAuth feedback IDs |
| `UploadTrack` | Tracks announced YouTube / TikTok videos |

---

## 🚀 Production Deployment

### Using PM2 (recommended)

```bash
npm install -g pm2
pm2 start src/index.js --name ogsware-bot
pm2 save
pm2 startup
```

### Using systemd

Create `/etc/systemd/system/ogsware-bot.service`:

```ini
[Unit]
Description=OGSware Discord Bot
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/ogsware-bot
ExecStart=/usr/bin/node src/index.js
Restart=on-failure
EnvironmentFile=/home/ubuntu/ogsware-bot/.env

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable ogsware-bot
sudo systemctl start ogsware-bot
sudo systemctl status ogsware-bot
```

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Bot doesn't respond to `!commands` | Check **Message Content Intent** is enabled in Dev Portal |
| Slash commands not showing | Run `npm run deploy` and wait 1–5 minutes |
| MongoDB connection failed | Check `MONGO_URI` in `.env`, ensure MongoDB is running |
| QR codes not generating | Run `npm install` — ensure `qrcode` package is installed |
| YouTube not posting | Verify `YOUTUBE_API_KEY` and `youtube.channelId` in config |
| Bot can't DM users | User may have DMs disabled — this is expected behavior |
| Role restore not working | Ensure bot's role is **above** the roles it's trying to restore |

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `discord.js` v14 | Discord API library |
| `mongoose` | MongoDB ODM |
| `qrcode` | QR code image generation |
| `axios` | HTTP requests (YouTube, SellAuth) |
| `rss-parser` | TikTok RSS feed parsing |
| `dotenv` | Environment variable loading |

---

## 📝 License

MIT — Free to use and modify for your own server.
