const config = require('../../config/config');
const embeds = require('../embeds/embeds');
const { RoleMemory } = require('../database/models');
const Invite = require('../database/models/invite');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {

    // ─── Detect which invite was used ───────────────────────────────────────
    let usedInvite = null;
    try {
      const freshInvites = await member.guild.invites.fetch();
      const dbInvites = await Invite.find({ guildId: member.guild.id });

      for (const dbInv of dbInvites) {
        const fresh = freshInvites.get(dbInv.code);
        if (fresh && fresh.uses > dbInv.uses) {
          usedInvite = dbInv;
          // Update uses count and add invited user
          dbInv.uses = fresh.uses;
          dbInv.invitedUsers.push(member.id);
          await dbInv.save();
          break;
        }
      }

      // Sync any new invites we haven't seen
      for (const [code, inv] of freshInvites) {
        await Invite.findOneAndUpdate(
          { code },
          { userId: inv.inviter?.id || 'unknown', guildId: member.guild.id, code, uses: inv.uses },
          { upsert: true }
        );
      }
    } catch (err) {
      console.error('[Invites] Error detecting invite:', err.message);
    }

    // ─── Restore Roles ──────────────────────────────────────────────────────
    const memory = await RoleMemory.findOne({ userId: member.id, guildId: member.guild.id });
    let restoredRoles = [];

    if (memory && memory.roles.length) {
      for (const roleId of memory.roles) {
        const role = member.guild.roles.cache.get(roleId);
        if (!role || role.managed || role.id === member.guild.id) continue;
        await member.roles.add(role).catch(() => null);
        restoredRoles.push(`<@&${roleId}>`);
      }
    }

    // ─── Join Log ───────────────────────────────────────────────────────────
    const logChannel = client.channels.cache.get(config.channels.joinLog);
    if (!logChannel) return;

    const embed = embeds.joinLog(member);
    const fields = embed.data.fields;

    const rolesField = fields.find(f => f.name === '🏷️ Roles Restored');
    if (rolesField) rolesField.value = restoredRoles.length ? restoredRoles.join(', ') : 'None';

    // Add invite info field
    if (usedInvite) {
      embed.addFields({
        name: '📨 Invited By',
        value: `<@${usedInvite.userId}> (code: \`${usedInvite.code}\`)`,
        inline: false,
      });
    }

    await logChannel.send({ embeds: [embed] });
  },
};
