import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (msgs: DDeno.Message[], guild: DDeno.Guild) => {
  const channels = await client.ch.getLogChannels('messageevents', { guildId: guild.id });
  if (!channels) return;

  const identMsg = msgs[0];
  if (!identMsg.guildId) return;

  const channel = await client.ch.cache.channels.get(identMsg.channelId, identMsg.guildId);
  if (!channel) return;

  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.message;
  const con = client.customConstants.events.logs.message;
  const audit = await client.ch.getAudit(guild, 73, channel.id);
  const auditUser =
    audit && audit.userId ? await client.ch.cache.users.get(audit.userId) : undefined;

  const embed: DDeno.Embed = {
    author: {
      iconUrl: con.delete,
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
    )(client, { id: m.id, channelId: m.channelId, guildId: m.guildId }, m, auditUser),
  );
};
