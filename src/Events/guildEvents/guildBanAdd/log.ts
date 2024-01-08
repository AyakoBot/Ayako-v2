import type * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (ban: Discord.GuildBan) => {
 const channels = await ban.client.util.getLogChannels('guildevents', ban.guild);
 if (!channels) return;

 if (ban.partial) {
  ban = await ban.client.util.request.guilds
   .getMemberBan(ban.guild, ban.user.id)
   .then((b) => ('message' in b ? ban : b));
 }

 const language = await ban.client.util.getLanguage(ban.guild.id);
 const lan = language.events.logs.guild;
 const con = ban.client.util.constants.events.logs.guild;
 const audit = await ban.client.util.getAudit(ban.guild, 22, ban.user.id);
 const auditUser = audit?.executor ?? undefined;

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.BanCreate,
   name: lan.ban,
  },
  description: auditUser ? lan.descBanAudit(ban.user, auditUser) : lan.descBan(ban.user),
  fields: [],
  color: CT.Colors.Success,
  timestamp: new Date().toISOString(),
 };

 if (ban && ban.reason) embed.fields?.push({ name: language.t.Reason, value: ban.reason });

 ban.client.util.send({ id: channels, guildId: ban.guild.id }, { embeds: [embed] }, 10000);
};
