const { RoleMemory } = require('../database/models');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    // Save non-managed, non-everyone roles
    const roles = member.roles.cache
      .filter(r => !r.managed && r.id !== member.guild.id)
      .map(r => r.id);

    await RoleMemory.findOneAndUpdate(
      { userId: member.id, guildId: member.guild.id },
      { roles },
      { upsert: true, new: true }
    );

    console.log(`[RoleMemory] Saved ${roles.length} roles for ${member.user.tag}`);
  },
};
