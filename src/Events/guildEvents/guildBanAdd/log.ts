import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (ban: Discord.GuildBan) => {
 const channels = await ch.getLogChannels('guildevents', ban.guild);
 if (!channels) return;

 if (ban.partial) {
  ban = await ch.request.guilds
   .getMemberBan(ban.guild, ban.user.id)
   .then((b) => ('message' in b ? ban : b));
 }

 const language = await ch.languageSelector(ban.guild.id);
 const lan = language.events.logs.guild;
 const con = ch.constants.events.logs.guild;
 const audit = await ch.getAudit(ban.guild, 22, ban.user.id);
 const auditUser = audit?.executor ?? undefined;

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.BanCreate,
   name: lan.ban,
  },
  description: auditUser ? lan.descBanAudit(ban.user, auditUser) : lan.descBan(ban.user),
  fields: [],
  color: ch.constants.colors.success,
  timestamp: new Date().toISOString(),
 };

 if (ban && ban.reason) embed.fields?.push({ name: language.reason, value: ban.reason });

 ch.send({ id: channels, guildId: ban.guild.id }, { embeds: [embed] }, undefined, 10000);
};
