import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (payload: {
  channelId: bigint;
  messageId: bigint;
  guildId?: bigint;
  emoji: DDeno.Emoji;
}) => {
  if (!payload.guildId) return;

  const ident = payload.emoji.id ?? payload.emoji.name;
  if (!ident) return;

  const cache = client.ch.cache.reactions.cache
    .get(payload.guildId)
    ?.get(payload.channelId)
    ?.get(payload.messageId)
    ?.get(ident);

  client.ch.cache.reactions.delete(ident, payload.messageId, payload.channelId, payload.guildId);

  const files: {
    default: (
      t: {
        channelId: bigint;
        messageId: bigint;
        guildId?: bigint;
        emoji: DDeno.Emoji;
      },
      c?: {
        users: bigint[];
        emoji: DDeno.Emoji;
      },
    ) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(payload, cache));
};
