import type * as Discord from 'discord.js';

export default async (role: Discord.Role) => {
 role.client.util.importCache.Events.BotEvents.roleEvents.roleCreate.log.file.default(role);
};
