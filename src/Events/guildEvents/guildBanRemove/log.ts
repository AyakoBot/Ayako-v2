import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (ban: Discord.GuildBan) => {
 const channels = await ch.getLogChannels('guildevents', ban.guild);
 if (!channels) return;

 const language = await ch.languageSelector(ban.guild.id);
 const lan = language.events.logs.guild;
 const con = ch.constants.events.logs.guild;
 const audit = await ch.getAudit(ban.guild, 23, ban.user.id);
 const auditUser = audit?.executor ?? undefined;

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.BanRemove,
   name: lan.unban,
  },
  description: auditUser ? lan.descUnbanAudit(ban.user, auditUser) : lan.descUnban(ban.user),
  fields: [],
  color: ch.constants.colors.success,
 };

 ch.send({ id: channels, guildId: ban.guild.id }, { embeds: [embed] }, undefined, 10000);
};
