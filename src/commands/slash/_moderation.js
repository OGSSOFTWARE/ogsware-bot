const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require('discord.js');
const embeds = require('../../embeds/embeds');
const config = require('../../../config/config');

// Helper: send to mod log
async function logAction(client, options) {
  const ch = client.channels.cache.get(config.channels.modLog);
  if (!ch) return;
  await ch.send({ embeds: [embeds.modLog(options)] });
}

// ─── /ban ─────────────────────────────────────────────────────────────────
const ban = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .addIntegerOption(o => o.setName('days').setDescription('Days of messages to delete (0-7)').setMinValue(0).setMaxValue(7)),
  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const days   = interaction.options.getInteger('days') || 0;
    await interaction.guild.members.ban(target, { reason, deleteMessageDays: days });
    await interaction.reply({ content: `✅ Banned **${target.tag}**.`, ephemeral: true });
    await logAction(client, { action: 'BAN', target, moderator: interaction.user, reason });
  },
};

// ─── /unban ───────────────────────────────────────────────────────────────
const unban = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user by ID')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(o => o.setName('userid').setDescription('User ID').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason')),
  async execute(interaction, client) {
    const userId = interaction.options.getString('userid');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const user   = await client.users.fetch(userId).catch(() => null);
    if (!user) return interaction.reply({ content: '❌ User not found.', ephemeral: true });
    await interaction.guild.bans.remove(userId, reason);
    await interaction.reply({ content: `✅ Unbanned **${user.tag}**.`, ephemeral: true });
    await logAction(client, { action: 'UNBAN', target: user, moderator: interaction.user, reason });
  },
};

// ─── /kick ────────────────────────────────────────────────────────────────
const kick = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(o => o.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason')),
  async execute(interaction, client) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    await target.kick(reason);
    await interaction.reply({ content: `✅ Kicked **${target.user.tag}**.`, ephemeral: true });
    await logAction(client, { action: 'KICK', target: target.user, moderator: interaction.user, reason });
  },
};

// ─── /timeout ─────────────────────────────────────────────────────────────
const timeout = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addIntegerOption(o => o.setName('duration').setDescription('Duration in minutes').setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption(o => o.setName('reason').setDescription('Reason')),
  async execute(interaction, client) {
    const target   = interaction.options.getMember('user');
    const duration = interaction.options.getInteger('duration');
    const reason   = interaction.options.getString('reason') || 'No reason provided';
    await target.timeout(duration * 60 * 1000, reason);
    await interaction.reply({ content: `✅ Timed out **${target.user.tag}** for ${duration} minute(s).`, ephemeral: true });
    await logAction(client, { action: 'TIMEOUT', target: target.user, moderator: interaction.user, reason, extra: `Duration: ${duration}m` });
  },
};

// ─── /untimeout ───────────────────────────────────────────────────────────
const untimeout = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Remove a member\'s timeout')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)),
  async execute(interaction, client) {
    const target = interaction.options.getMember('user');
    await target.timeout(null);
    await interaction.reply({ content: `✅ Removed timeout for **${target.user.tag}**.`, ephemeral: true });
    await logAction(client, { action: 'UNTIMEOUT', target: target.user, moderator: interaction.user, reason: 'Manual removal' });
  },
};

// ─── /addrole ─────────────────────────────────────────────────────────────
const addrole = {
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Add a role to a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)),
  async execute(interaction, client) {
    const target = interaction.options.getMember('user');
    const role   = interaction.options.getRole('role');
    await target.roles.add(role);
    await interaction.reply({ content: `✅ Added **${role.name}** to **${target.user.tag}**.`, ephemeral: true });
    await logAction(client, { action: 'ADD ROLE', target: target.user, moderator: interaction.user, reason: `Role: ${role.name}` });
  },
};

// ─── /removerole ──────────────────────────────────────────────────────────
const removerole = {
  data: new SlashCommandBuilder()
    .setName('removerole')
    .setDescription('Remove a role from a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)),
  async execute(interaction, client) {
    const target = interaction.options.getMember('user');
    const role   = interaction.options.getRole('role');
    await target.roles.remove(role);
    await interaction.reply({ content: `✅ Removed **${role.name}** from **${target.user.tag}**.`, ephemeral: true });
    await logAction(client, { action: 'REMOVE ROLE', target: target.user, moderator: interaction.user, reason: `Role: ${role.name}` });
  },
};

// ─── /nuke ────────────────────────────────────────────────────────────────
const nuke = {
  data: new SlashCommandBuilder()
    .setName('nuke')
    .setDescription('Clone and delete this channel (nuke it)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction, client) {
    const channel = interaction.channel;
    await interaction.reply({ content: '💣 Nuking channel...', ephemeral: true });
    const newChannel = await channel.clone();
    await newChannel.setPosition(channel.position);
    await channel.delete();
    await newChannel.send({ content: '💥 Channel has been nuked.' });
    await logAction(client, { action: 'NUKE', target: { id: 'N/A', tag: channel.name }, moderator: interaction.user, reason: 'Channel nuke' });
  },
};

// Export all as individual modules (discord.js loads each file separately)
// We use a single file with multiple exports for cleanliness, but each is exported as named
module.exports = { ban, unban, kick, timeout, untimeout, addrole, removerole, nuke };
