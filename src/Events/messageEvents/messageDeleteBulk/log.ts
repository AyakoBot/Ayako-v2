import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';

export default async (
 msgs: Discord.Collection<Discord.Snowflake, Discord.Message>,
 channel: Discord.GuildTextBasedChannel,
) => {
 const channels = await ch.getLogChannels('messageevents', channel.guild);
 if (!channels) return;

 const language = await ch.languageSelector(channel.guild.id);
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
  color: ch.constants.colors.danger,
 };

 await ch.send({ id: channels, guildId: channel.guild.id }, { embeds: [embed] });

 msgs.forEach((m) => client.emit('messageDelete', m));
};
