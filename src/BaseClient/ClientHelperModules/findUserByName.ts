export default async (name: string) =>
 (
  await (
   await import('../Client.js')
  ).default.shard?.broadcastEval(
   (cl, { n }) => cl.users.cache.filter((u) => u.username.toLowerCase().includes(n.toLowerCase())),
   {
    context: { n: name },
   },
  )
 )?.flat() ?? [];
