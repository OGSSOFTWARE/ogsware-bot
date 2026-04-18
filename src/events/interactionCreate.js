module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {

    // ─── Slash Commands ──────────────────────────────────────────────────────
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return interaction.reply({ content: '❌ Unknown command.', ephemeral: true });
      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(`[CMD] Error in /${interaction.commandName}:`, err);
        const msg = { content: '❌ An error occurred.', ephemeral: true };
        interaction.replied || interaction.deferred
          ? interaction.followUp(msg)
          : interaction.reply(msg);
      }
      return;
    }

    // ─── Modal Submissions ───────────────────────────────────────────────────
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'vouch_modal') {
        const vouchCmd = require('../commands/slash/createvouch');
        return vouchCmd.handleModal(interaction);
      }
    }

    // ─── Button Interactions ─────────────────────────────────────────────────
    if (interaction.isButton()) {
      const { customId } = interaction;

      // Copy crypto address buttons
      if (customId.startsWith('copy_')) {
        const coin = customId.replace('copy_', '');
        const config = require('../../config/config');
        const address = config.wallets[coin];
        return interaction.reply({ content: `\`${address}\``, ephemeral: true });
      }

      // Giveaway reroll
      if (customId.startsWith('reroll_')) {
        const messageId = customId.replace('reroll_', '');
        const giveawayCmd = require('../commands/slash/creategiveaway');
        return giveawayCmd.reroll(interaction, messageId);
      }
    }
  },
};
