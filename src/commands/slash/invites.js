const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Invite = require('../../database/models/invite');
const config = require('../../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invites')
    .setDescription('Check how many invites a user has')
    .addUserOption(o =>
      o.setName('user')
        .setDescription('User to check (defaults to yourself)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;

    // Get all invites for this user in this guild
    const userInvites = await Invite.find({
      userId: target.id,
      guildId: interaction.guild.id,
    });

    const totalUses    = userInvites.reduce((sum, inv) => sum + inv.uses, 0);
    const totalInvited = userInvites.reduce((sum, inv) => sum + inv.invitedUsers.length, 0);
    const activeCodes  = userInvites.filter(inv => inv.uses > 0);

    const embed = new EmbedBuilder()
      .setTitle(`📨 Invites — ${target.username}`)
      .setThumbnail(target.displayAvatarURL({ size: 128 }))
      .setColor(config.embedDefaults.color)
      .addFields(
        { name: '✅ Total Invites', value: `${totalUses}`, inline: true },
        { name: '👥 Members Joined', value: `${totalInvited}`, inline: true },
        { name: '🔗 Active Codes', value: `${userInvites.length}`, inline: true },
      )
      .setFooter({ text: config.embedDefaults.footerText, iconURL: config.embedDefaults.footerIcon })
      .setTimestamp();

    // Show individual invite codes if any
    if (activeCodes.length > 0) {
      const codeList = activeCodes
        .sort((a, b) => b.uses - a.uses)
        .slice(0, 10) // max 10
        .map(inv => `\`${inv.code}\` — **${inv.uses}** use${inv.uses !== 1 ? 's' : ''}`)
        .join('\n');
      embed.addFields({ name: '🔗 Invite Codes', value: codeList, inline: false });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
