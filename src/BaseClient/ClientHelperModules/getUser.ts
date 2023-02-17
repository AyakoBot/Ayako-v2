import type CT from '../../Typings/CustomTypings';

export default async (id: string) => {
  const client = (await import('../Client.js')).default;

  const response = (
    await client.shard?.broadcastEval((cl, { id }) => cl.users.cache.get(id), {
      context: { id },
    })
  )
    ?.flat()
    .find((u): u is CT.bEvalUser => !!u);

  if (response) return response;
  return client.users.fetch(id).catch(() => undefined);
};
