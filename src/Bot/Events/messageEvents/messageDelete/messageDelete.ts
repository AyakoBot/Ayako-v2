import type * as DDeno from 'discordeno';

export default async (
  payload: {
    id: bigint;
    channelId: bigint;
    guildId?: bigint;
  },
  message: DDeno.Message,
  executor?: DDeno.User,
) => {
  if (!payload) return;
  if (!('guildId' in payload) || !payload.guildId) return;

  const files: { default: (t: DDeno.Message, e?: DDeno.User) => void }[] = await Promise.all(
    ['./giveaway.js', './log.js', './cache.js'].map((p) => import(p)),
  );

  files.forEach((f) => f.default(message, executor));
};
