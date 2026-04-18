require('dotenv').config();
const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../config/config');

// ─── Client Setup ──────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildInvites,
  ],
});

client.prefixCommands = new Collection();
client.slashCommands  = new Collection();

// ─── Load Prefix Commands ──────────────────────────────────────────────────
const prefixDir = path.join(__dirname, 'commands', 'prefix');
for (const file of fs.readdirSync(prefixDir).filter(f => f.endsWith('.js'))) {
  const cmd = require(path.join(prefixDir, file));
  client.prefixCommands.set(cmd.name.toLowerCase(), cmd);
  (cmd.aliases || []).forEach(a => client.prefixCommands.set(a.toLowerCase(), cmd));
}

// ─── Load Slash Commands ───────────────────────────────────────────────────
const slashDir = path.join(__dirname, 'commands', 'slash');
for (const file of fs.readdirSync(slashDir).filter(f => f.endsWith('.js') && !f.startsWith('_'))) {
  const cmd = require(path.join(slashDir, file));
  if (!cmd.data) continue;
  client.slashCommands.set(cmd.data.name, cmd);
}

// ─── Load Events ───────────────────────────────────────────────────────────
const eventsDir = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsDir).filter(f => f.endsWith('.js'))) {
  const event = require(path.join(eventsDir, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// ─── Database ──────────────────────────────────────────────────────────────
mongoose.connect(config.mongoUri)
  .then(() => console.log('[DB] Connected to MongoDB'))
  .catch(err => console.error('[DB] Connection error:', err));

// ─── Start Services ────────────────────────────────────────────────────────
client.once('ready', () => {
  console.log(`[BOT] Logged in as ${client.user.tag}`);

  // Set status
  client.user.setPresence({
    activities: [{ name: config.status.text, type: ActivityType[config.status.type] }],
    status: 'online',
  });

  // Start polling services
  require('./services/youtubeService')(client);
  require('./services/tiktokService')(client);
  require('./services/sellAuthService')(client);
});

client.login(config.token);
