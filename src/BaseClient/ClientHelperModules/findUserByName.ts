export default async (name: string) => {
 const client = (await import('../Client.js')).default;

 const response = (
  await client.shard?.broadcastEval(
   (cl, { n }) => cl.users.cache.filter((u) => u.username.toLowerCase().includes(n.toLowerCase())),
   {
    context: { n: name },
   },
  )
 )?.flat();

 return response ?? [];
};
