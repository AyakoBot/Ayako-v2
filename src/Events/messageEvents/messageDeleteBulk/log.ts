import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';
import messageDelete from '../messageDelete/messageDelete.js';

export default async (
 msgs: Discord.Collection<Discord.Snowflake, Discord.Message>,
 channel: Discord.GuildTextBasedChannel,
) => {
 const channels = await ch.getLogChannels('messageevents', channel.guild);
 if (!channels) return;

 const language = await ch.getLanguage(channel.guild.id);
 const lan = language.events.logs.message;
 const con = ch.constants.events.logs.message;
 const audit = await ch.getAudit(channel.guild, 73, channel.id);
 const auditUser = audit?.executor ?? undefined;

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.delete,
   name: lan.nameDelete,
  },
  description: auditUser
   ? lan.descDeleteBulkAudit(auditUser, msgs.size, channel)
   : lan.descDeleteBulk(msgs.size, channel),
  fields: [],
  color: CT.Colors.Danger,
  timestamp: new Date().toISOString(),
 };

 await ch.send({ id: channels, guildId: channel.guild.id }, { embeds: [embed] });

 msgs.forEach((m) => messageDelete(m));
};
