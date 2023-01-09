import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (payload: { channelId: bigint; messageId: bigint; guildId?: bigint }) => {
  if (!payload.guildId) return;

  const cache = client.reactions
    .get(payload.guildId)
    ?.get(payload.channelId)
    ?.get(payload.messageId);

  const files: {
    default: (
      t: { channelId: bigint; messageId: bigint; guildId?: bigint },
      c?: Map<
        bigint | string,
        {
          count: number;
          users: bigint[];
          emoji: DDeno.Emoji;
        }
      >,
    ) => void;
  }[] = await Promise.all(['./log.js', './cache.js'].map((p) => import(p)));

  files.forEach((f) => f.default(payload, cache));
};
