import * as Discord from 'discord.js';
import guildMemberPrune from '../guildMemberPrune/guildMemberPrune.js';
import cache from './cache.js';

export default async (entry: Discord.GuildAuditLogsEntry, guild: Discord.Guild) => {
 cache(entry, guild);

 switch (entry.action) {
  case Discord.AuditLogEvent.MemberPrune:
   guildMemberPrune(entry, guild);
   break;
  default:
   break;
 }
};
