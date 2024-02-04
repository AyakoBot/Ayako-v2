import type * as Discord from 'discord.js';

export default async (role: Discord.Role) => {
 role.client.util.importCache.Events.BotEvents.roleEvents.roleDelete.log.file.default(role);
 role.client.util.importCache.Events.BotEvents.roleEvents.roleDelete.customRole.file.default(role);
};
