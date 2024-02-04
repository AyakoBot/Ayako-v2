import type * as Discord from 'discord.js';

export default async (ban: Discord.GuildBan) => {
 ban.client.util.importCache.Events.BotEvents.guildEvents.guildBanRemove.log.file.default(ban);
 ban.client.util.importCache.Events.BotEvents.guildEvents.guildBanRemove.cache.file.default(ban);
};
