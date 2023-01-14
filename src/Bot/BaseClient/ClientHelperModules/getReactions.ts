import type * as DDeno from 'discordeno';
import client from '../DDenoClient.js';

export default async (message: DDeno.Message, channelId: bigint, reactionId: bigint | string) => {
  const fetch = (lastId?: bigint) =>
    client.helpers.getReactions(channelId, message.id, String(reactionId), {
      limit: 100,
      after: String(lastId),
    });

  const reactions = [...(await fetch()).map((o) => o)];

  for (
    let i = 1;
    i <
      Number(message.reactions?.find((r) => (r.emoji.id ?? r.emoji.name) === reactionId)?.count) /
        100 ?? 0;
    i += 1
  ) {
    // eslint-disable-next-line no-await-in-loop
    reactions.push(...(await fetch()).map((o) => o));
  }

  reactions.forEach((r) => client.ch.cache.users.set(r));

  return reactions;
};
