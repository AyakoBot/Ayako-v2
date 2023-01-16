import Discord from 'discord.js';
import client from '../DDenoClient.js';

export default async (
  guildId: bigint,
  userId: bigint,
  permissions: Discord.PermissionResolvable[],
) => {
  const roles = await client.helpers.getRoles(guildId);
  if (!roles) return false;

  roles.forEach((r) => client.ch.cache.roles.set(r));
  const member = await client.ch.cache.members.get(userId, guildId);
  if (!member) return false;

  const memberRoles = roles
    .filter((r) => member.roles.includes(r.id))
    .map((o) => o)
    .sort((a, b) => b.position - a.position);

  const allowedPermissions = permissions.map((perm) => {
    let hasPermission = false;

    memberRoles.forEach((r) => {
      const permission = new Discord.PermissionsBitField(r.permissions);
      hasPermission = permission.has(perm, true);
    });

    return hasPermission;
  });

  return !allowedPermissions.includes(false);
};
