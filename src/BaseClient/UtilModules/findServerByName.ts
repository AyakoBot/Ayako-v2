/**
 * Finds all servers whose name includes the given string.
 * @param name - The string to search for in server names.
 * @returns An array of guilds whose name includes the given string.
 */
export default async (name: string) => {
 const client = (await import('../Bot/Client.js')).default;

 const response = (
  await client.cluster?.broadcastEval(
   (cl, { n }) => cl.guilds.cache.filter((g) => g.name.toLowerCase().includes(n.toLowerCase())),
   {
    context: { n: name },
   },
  )
 )?.flat();

 return response ?? [];
};
