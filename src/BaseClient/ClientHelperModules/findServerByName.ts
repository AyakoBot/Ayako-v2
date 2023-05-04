export default async (name: string) => {
 const client = (await import('../Client.js')).default;

 const response = (
  await client.shard?.broadcastEval(
   (cl, { name }) =>
    cl.guilds.cache.filter((g) => g.name.toLowerCase().includes(name.toLowerCase())),
   {
    context: { name },
   },
  )
 )?.flat();

 return response ?? [];
};
