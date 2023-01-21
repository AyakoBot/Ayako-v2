import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (
  msgs: Discord.Collection<Discord.Snowflake, Discord.Message>,
  channel: Discord.GuildTextBasedChannel,
) => {
  const channels = await client.ch.getLogChannels('messageevents', channel.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(channel.guild.id);
  const lan = language.events.logs.message;
  const con = client.customConstants.events.logs.message;
  const audit = await client.ch.getAudit(channel.guild, 73, channel.id);
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
    color: client.customConstants.colors.warning,
  };

  await client.ch.send({ id: channels, guildId: channel.guild.id }, { embeds: [embed] }, language);

  msgs.forEach((m) => client.emit('messageDelete', m));
};
