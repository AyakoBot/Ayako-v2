import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import messageDelete from '../messageDelete/messageDelete.js';

export default async (
 msgs: Discord.Collection<Discord.Snowflake, Discord.Message>,
 channel: Discord.GuildTextBasedChannel,
) => {
 const channels = await channel.client.util.getLogChannels('messageevents', channel.guild);
 if (!channels) return;

 const language = await channel.client.util.getLanguage(channel.guild.id);
 const lan = language.events.logs.message;
 const con = channel.client.util.constants.events.logs.message;
 const audit = await channel.client.util.getAudit(channel.guild, 73, channel.id);
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

 const msg = await channel.client.util
  .send({ id: channels, guildId: channel.guild.id }, { embeds: [embed] })
  .then((m) => (m && 'message' in m ? undefined : m));

 msgs
  .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
  .forEach((m) =>
   messageDelete(m, msg ? msg.filter((m2): m2 is Discord.Message<true> => !!m2) : false),
  );
};
