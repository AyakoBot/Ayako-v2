import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (msgs: DDeno.Message[], guild: DDeno.Guild) => {
  const channels = await client.ch.getLogChannels('messageevents', { guildId: guild.id });
  if (!channels) return;

  const identMsg = msgs[0];
  if (!identMsg.guild.id) return;

  const channel = await client.ch.cache.channels.get(identMsg.channelId, identMsg.guild.id);
  if (!channel) return;

  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.message;
  const con = client.customConstants.events.logs.message;
  const audit = await client.ch.getAudit(guild, 73, channel.id);
  const auditUser =
    audit && audit.userId ? await client.users.fetch(audit.userId) : undefined;

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.delete,
      name: lan.nameDelete,
    },
    description: auditUser
      ? lan.descDeleteBulkAudit(auditUser, msgs, channel)
      : lan.descDeleteBulk(msgs, channel),
    fields: [],
    color: client.customConstants.colors.warning,
  };

  await client.ch.send({ id: channels, guildId: guild.id }, { embeds: [embed] }, language);

  msgs.forEach((m) =>
    (
      client.events.messageDelete as unknown as (
        c: DDeno.Bot,
        p: { id: bigint; channelId: bigint; guildId: bigint | undefined },
        me?: DDeno.Message,
        u?: DDeno.User,
      ) => void
    )(client, { id: m.id, channelId: m.channelId, guildId: m.guild.id }, m, auditUser),
  );
};
