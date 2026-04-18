require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

const commands = [];
const slashDir = path.join(__dirname, 'commands', 'slash');

for (const file of fs.readdirSync(slashDir).filter(f => f.endsWith('.js') && !f.startsWith('_'))) {
  const cmd = require(path.join(slashDir, file));
  if (!cmd.data) continue;
  commands.push(cmd.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log(`Deploying ${commands.length} slash commands...`);
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands }
    );
    console.log('✅ Slash commands deployed successfully.');
  } catch (err) {
    console.error(err);
  }
})();