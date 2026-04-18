const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Sticky } = require('../../database/models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stickymessage')
    .setDescription('Set or remove a sticky message in this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(sub =>
      sub.setName('set')
        .setDescription('Set the sticky message')
        .addStringOption(o => o.setName('message').setDescription('The sticky message content').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Remove the sticky message from this channel')
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'set') {
      const message = interaction.options.getString('message');
      await Sticky.findOneAndUpdate(
        { channelId: interaction.channel.id },
        { channelId: interaction.channel.id, guildId: interaction.guild.id, message, lastMsgId: null },
        { upsert: true, new: true }
      );
      return interaction.reply({ content: `✅ Sticky message set in ${interaction.channel}.`, ephemeral: true });
    }

    if (sub === 'remove') {
      await Sticky.findOneAndDelete({ channelId: interaction.channel.id });
      return interaction.reply({ content: `✅ Sticky message removed from ${interaction.channel}.`, ephemeral: true });
    }
  },
};
