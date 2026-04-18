const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const embeds = require('../../embeds/embeds');
const { Giveaway } = require('../../database/models');
const config = require('../../../config/config');

async function pickWinners(messageId, channel, count) {
  const message = await channel.messages.fetch(messageId).catch(() => null);
  if (!message) return [];
  const reaction = message.reactions.cache.get('🎉');
  if (!reaction) return [];
  const users = await reaction.users.fetch();
  const eligible = users.filter(u => !u.bot).map(u => u.id);
  const shuffled = eligible.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('creategiveaway')
    .setDescription('Create a giveaway')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
    .addStringOption(o => o.setName('prize').setDescription('Prize').setRequired(true))
    .addIntegerOption(o => o.setName('duration').setDescription('Duration in minutes').setRequired(true).setMinValue(1))
    .addIntegerOption(o => o.setName('winners').setDescription('Number of winners').setRequired(true).setMinValue(1).setMaxValue(20))
    .addStringOption(o => o.setName('description').setDescription('Optional description')),

  async execute(interaction, client) {
    const prize       = interaction.options.getString('prize');
    const duration    = interaction.options.getInteger('duration');
    const winnerCount = interaction.options.getInteger('winners');
    const description = interaction.options.getString('description') || '';

    const endsAt = new Date(Date.now() + duration * 60 * 1000);

    const channel = client.channels.cache.get(config.channels.giveaways) || interaction.channel;
    const embed   = embeds.giveaway({ prize, description, winners: winnerCount, endsAt, host: interaction.user.id });

    const msg = await channel.send({ embeds: [embed] });
    await msg.react('🎉');

    await Giveaway.create({
      messageId: msg.id,
      channelId: channel.id,
      guildId:   interaction.guild.id,
      prize,
      description,
      winnerCount,
      endsAt,
      hostId: interaction.user.id,
    });

    await interaction.reply({ content: `✅ Giveaway created in ${channel}!`, ephemeral: true });

    // Schedule end
    setTimeout(async () => {
      await endGiveaway(msg.id, channel.id, client);
    }, duration * 60 * 1000);
  },

  // Called on bot restart to restore timers
  async restoreTimer(giveaway, client) {
    const remaining = giveaway.endsAt.getTime() - Date.now();
    if (remaining <= 0) {
      await endGiveaway(giveaway.messageId, giveaway.channelId, client);
    } else {
      setTimeout(() => endGiveaway(giveaway.messageId, giveaway.channelId, client), remaining);
    }
  },

  // Reroll handler
  async reroll(interaction, messageId) {
    const giveaway = await Giveaway.findOne({ messageId });
    if (!giveaway || !giveaway.ended)
      return interaction.reply({ content: '❌ No ended giveaway found.', ephemeral: true });

    const channel = interaction.client.channels.cache.get(giveaway.channelId);
    const newWinners = await pickWinners(messageId, channel, giveaway.winnerCount);
    if (!newWinners.length)
      return interaction.reply({ content: '❌ No eligible participants.', ephemeral: true });

    await interaction.reply({
      content: `🎉 **Reroll!** New winner(s): ${newWinners.map(id => `<@${id}>`).join(', ')} — Congrats!`,
    });

    giveaway.winners = newWinners;
    await giveaway.save();
  },
};

async function endGiveaway(messageId, channelId, client) {
  const giveaway = await Giveaway.findOne({ messageId, ended: false });
  if (!giveaway) return;

  giveaway.ended = true;

  const channel = client.channels.cache.get(channelId);
  if (!channel) { await giveaway.save(); return; }

  const winnerIds = await pickWinners(messageId, channel, giveaway.winnerCount);
  giveaway.winners = winnerIds;
  await giveaway.save();

  const embed = embeds.giveawayEnded({ prize: giveaway.prize, winnerIds });
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`reroll_${messageId}`)
      .setLabel('🔄 Reroll')
      .setStyle(ButtonStyle.Secondary)
  );

  const original = await channel.messages.fetch(messageId).catch(() => null);
  if (original) await original.edit({ embeds: [embed], components: [row] });

  if (winnerIds.length) {
    await channel.send(`🎉 Congratulations ${winnerIds.map(id => `<@${id}>`).join(', ')}! You won **${giveaway.prize}**!`);
  } else {
    await channel.send(`😔 No valid entries for **${giveaway.prize}**.`);
  }
}
