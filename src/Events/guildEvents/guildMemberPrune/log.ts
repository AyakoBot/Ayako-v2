import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (audit: Discord.GuildAuditLogsEntry, guild: Discord.Guild) => {
 const channels = await ch.getLogChannels('guildevents', guild);
 if (!channels) return;

 const language = await ch.getLanguage(guild.id);
 const lan = language.events.logs.guild;
 const con = ch.constants.events.logs.guild;
 const extra = audit.extra as { removed: number; days: number };

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.Prune,
   name: lan.memberPrune,
  },
  description: lan.descMemberPrune(audit.executor as Discord.User, extra.removed, extra.days),
  color: ch.constants.colors.danger,
  timestamp: new Date().toISOString(),
 };

 ch.send({ id: channels, guildId: guild.id }, { embeds: [embed] }, 10000);
};
