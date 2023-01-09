import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (payload: {
  channelId: bigint;
  messageId: bigint;
  guildId?: bigint;
  emoji: DDeno.Emoji;
}) => {
  if (!payload.guildId) return;

  const cache = client.reactions
    .get(payload.guildId)
    ?.get(payload.channelId)
    ?.get(payload.messageId)
    ?.get(payload.emoji.id ?? payload.emoji.name);

  const files: {
    default: (
      t: {
        channelId: bigint;
        messageId: bigint;
        guildId?: bigint;
        emoji: DDeno.Emoji;
      },
      c?: {
        count: number;
        users: bigint[];
        emoji: DDeno.Emoji;
      },
    ) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(payload, cache));
};
