import type * as Discord from 'discord.js';

export default async (oldRole: Discord.Role, role: Discord.Role) => {
 if (oldRole.position !== role.position) return;

 role.client.util.importCache.Events.BotEvents.roleEvents.roleUpdate.log.file.default(
  oldRole,
  role,
 );
};
