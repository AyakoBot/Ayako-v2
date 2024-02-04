import type * as Discord from 'discord.js';

export default async (entry: Discord.GuildAuditLogsEntry, guild: Discord.Guild) => {
 guild.client.util.importCache.Events.BotEvents.guildEvents.guildMemberPrune.log.file.default(
  entry,
  guild,
 );
};
