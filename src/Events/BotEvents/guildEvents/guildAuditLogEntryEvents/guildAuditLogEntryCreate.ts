import * as Discord from 'discord.js';

export default async (entry: Discord.GuildAuditLogsEntry, guild: Discord.Guild) => {
 guild.client.util.importCache.Events.BotEvents.guildEvents.guildAuditLogEntryEvents.cache.file.default(
  entry,
  guild,
 );

 switch (entry.action) {
  case Discord.AuditLogEvent.MemberPrune:
   guild.client.util.importCache.Events.BotEvents.guildEvents.guildMemberPrune.guildMemberPrune.file.default(
    entry,
    guild,
   );
   break;
  default:
   break;
 }
};
