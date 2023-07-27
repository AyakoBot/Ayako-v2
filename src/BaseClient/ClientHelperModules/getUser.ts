import type CT from '../../Typings/CustomTypings.js';

export default async (id: string) => {
 const client = (await import('../Client.js')).default;

 const response = (
  await client.shard?.broadcastEval((cl, { id: userID }) => cl.users.cache.get(userID), {
   context: { id },
  })
 )
  ?.flat()
  .find((u): u is CT.bEvalUser => !!u);

 if (response) return response;
 return client.users.fetch(id).catch(() => undefined);
};
