const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  AttachmentBuilder,
} = require('discord.js');
const embeds = require('../../embeds/embeds');
const { Vouch } = require('../../database/models');
const config = require('../../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createvouch')
    .setDescription('Submit a vouch for OGSware')
    .addAttachmentOption(o =>
      o.setName('image')
        .setDescription('Optional image to attach to your vouch')
        .setRequired(false)
    ),

  async execute(interaction) {
    // Store the attachment URL in a temp map before showing modal
    // (attachments aren't accessible after modal submit)
    const attachment = interaction.options.getAttachment('image');
    if (attachment) {
      global.vouchImages = global.vouchImages || {};
      global.vouchImages[interaction.user.id] = attachment.url;
    }

    const modal = new ModalBuilder()
      .setCustomId('vouch_modal')
      .setTitle('Leave a Vouch');

    const productInput = new TextInputBuilder()
      .setCustomId('product')
      .setLabel('What product did you purchase?')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(100);

    const ratingInput = new TextInputBuilder()
      .setCustomId('rating')
      .setLabel('Rating (1-5)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(1)
      .setPlaceholder('Enter a number from 1 to 5');

    const reviewInput = new TextInputBuilder()
      .setCustomId('review')
      .setLabel('Your Review')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMinLength(10)
      .setMaxLength(1000);

    modal.addComponents(
      new ActionRowBuilder().addComponents(productInput),
      new ActionRowBuilder().addComponents(ratingInput),
      new ActionRowBuilder().addComponents(reviewInput),
    );

    await interaction.showModal(modal);
  },

  async handleModal(interaction) {
    const product  = interaction.fields.getTextInputValue('product');
    const ratingRaw = interaction.fields.getTextInputValue('rating');
    const review   = interaction.fields.getTextInputValue('review');

    const rating = parseInt(ratingRaw);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return interaction.reply({ content: '❌ Rating must be a number between 1 and 5.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    // Grab stored image URL and user avatar
    const imageUrl    = global.vouchImages?.[interaction.user.id] || null;
    const avatarUrl   = interaction.user.displayAvatarURL({ size: 256, extension: 'png' });
    if (global.vouchImages) delete global.vouchImages[interaction.user.id];

    // Save to DB
    await Vouch.create({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
      product,
      rating,
      review,
      source: 'manual',
    });

    // Post in vouch channel
    const vouchChannel = interaction.client.channels.cache.get(config.channels.vouches);
    if (vouchChannel) {
      const embed = embeds.vouchEmbed({
        userId: interaction.user.id,
        product,
        rating,
        review,
        source: 'manual',
        thumbnailUrl: avatarUrl,
        imageUrl,
      });
      await vouchChannel.send({ embeds: [embed] });
    }

    // DM the user
    const dmEmbed = embeds.vouchDM({
      product,
      rating,
      review,
      thumbnailUrl: avatarUrl,
      imageUrl,
    });
    await interaction.user.send({ embeds: [dmEmbed] }).catch(() => null);

    await interaction.editReply({ content: '✅ Your vouch has been submitted! Thank you 🙏' });
  },
};
