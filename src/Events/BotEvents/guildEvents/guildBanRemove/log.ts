import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (ban: Discord.GuildBan) => {
 const channels = await ban.client.util.getLogChannels('guildevents', ban.guild);
 if (!channels) return;

 const language = await ban.client.util.getLanguage(ban.guild.id);
 const lan = language.events.logs.guild;
 const con = ban.client.util.constants.events.logs.guild;
 const audit = await ban.client.util.getAudit(ban.guild, 23, ban.user.id);
 const auditUser = audit?.executor ?? undefined;

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.BanRemove,
   name: lan.unban,
  },
  description: auditUser ? lan.descUnbanAudit(ban.user, auditUser) : lan.descUnban(ban.user),
  fields: [],
  color: CT.Colors.Success,
  timestamp: new Date().toISOString(),
 };

 ban.client.util.send({ id: channels, guildId: ban.guild.id }, { embeds: [embed] }, 10000);
};
