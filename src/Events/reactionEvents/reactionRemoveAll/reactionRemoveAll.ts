import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (payload: { channelId: bigint; messageId: bigint; guildId?: bigint }) => {
  if (!payload.guild.id) return;

  const cache = client.ch.cache.reactions.cache
    .get(payload.guild.id)
    ?.get(payload.channelId)
    ?.get(payload.messageId);

  if (cache) {
    Array.from(cache, ([, e]) => e).forEach((e) => {
      const ident = e.emoji.id ?? e.emoji.name;
      if (!ident) return;

      client.ch.cache.reactions.delete(
        ident,
        payload.messageId,
        payload.channelId,
        payload.guild.id as bigint,
      );
    });
  }

  const files: {
    default: (
      t: { channelId: bigint; messageId: bigint; guildId?: bigint },
      c?: Map<
        bigint | string,
        {
          users: bigint[];
          emoji: DDeno.Emoji;
        }
      >,
    ) => void;
  }[] = await Promise.all(['./log.js', './cache.js'].map((p) => import(p)));

  files.forEach((f) => f.default(payload, cache));
};
