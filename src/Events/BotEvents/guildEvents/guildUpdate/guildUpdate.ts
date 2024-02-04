import type * as Discord from 'discord.js';

export default async (oldGuild: Discord.Guild, guild: Discord.Guild) => {
 guild.client.util.importCache.Events.BotEvents.guildEvents.guildUpdate.log.file.default(
  oldGuild,
  guild,
 );
};
