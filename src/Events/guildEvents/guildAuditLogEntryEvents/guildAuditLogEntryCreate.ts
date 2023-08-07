import * as Discord from 'discord.js';
import cache from './cache.js';

export default async (entry: Discord.GuildAuditLogsEntry, guild: Discord.Guild) => {
 cache(entry, guild);

 switch (entry.action) {
  case Discord.AuditLogEvent.MemberPrune:
   guild.client.emit('guildMemberPrune', entry, guild);
   break;
  default:
   break;
 }
};
