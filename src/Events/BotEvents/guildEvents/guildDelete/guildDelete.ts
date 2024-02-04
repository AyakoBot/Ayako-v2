import type * as Discord from 'discord.js';

export default async (guild: Discord.Guild) => {
 guild.client.util.importCache.Events.BotEvents.guildEvents.guildDelete.log.file.default(guild);
 guild.client.util.importCache.Events.BotEvents.guildEvents.guildDelete.cache.file.default(guild);
};
