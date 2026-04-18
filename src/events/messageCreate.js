const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const embeds = require('../embeds/embeds');
const config = require('../../config/config');

const CRYPTO_COMMANDS = new Set(['bitcoin', 'litecoin', 'ethereum', 'solana']);
const PREFIX = '!';

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    // ─── Sticky Message Logic ───────────────────────────────────────────────
    const { Sticky } = require('../database/models');
    const sticky = await Sticky.findOne({ channelId: message.channel.id });
    if (sticky && !message.author.bot) {
      // Delete previous sticky if it exists
      if (sticky.lastMsgId) {
        const old = await message.channel.messages.fetch(sticky.lastMsgId).catch(() => null);
        if (old) await old.delete().catch(() => null);
      }
      const embed = embeds.sticky(sticky.message);
      const newMsg = await message.channel.send({ embeds: [embed] });
      sticky.lastMsgId = newMsg.id;
      await sticky.save();
    }

    // ─── Prefix Command Parsing ─────────────────────────────────────────────
    if (!message.content.startsWith(PREFIX)) return;
    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    if (CRYPTO_COMMANDS.has(commandName)) {
  const address = config.wallets[commandName];
  if (!address) return message.reply('❌ Wallet address not configured.');

  const embed = embeds[commandName](address, null);
  await message.channel.send({ embeds: [embed] });
  return;
}


    // ─── Standard Trigger Commands ──────────────────────────────────────────
    const triggerMap = {
      paypal:   () => embeds.paypal(),
      card:     () => embeds.card(),
      reselling:() => embeds.reselling(),
      promoter: () => embeds.promoter(),
      staff:    () => embeds.staff(),
      vouch:    () => embeds.vouch(),
      downloads:() => embeds.downloads(),
      website:  () => embeds.website(),
      guides:   () => embeds.guides(),
      status:   () => embeds.status(),
    };

    if (triggerMap[commandName]) {
      const embed = triggerMap[commandName]();
      return message.channel.send({ embeds: [embed] });
    }
  },
};
