export default async (name: string) => {
  const client = (await import('../Client.js')).default;

  const response = (
    await client.shard?.broadcastEval(
      (cl, { name }) =>
        cl.users.cache.filter((u) => u.username.toLowerCase().includes(name.toLowerCase())),
      {
        context: { name },
      },
    )
  )?.flat();

  return response ?? [];
};
