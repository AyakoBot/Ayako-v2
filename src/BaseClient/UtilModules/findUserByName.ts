/**
 * Finds users by their username.
 * @param name The username to search for.
 * @returns An array of users whose username includes the given name.
 */
export default async (name: string) =>
 (
  await (
   await import('../Bot/Client.js')
  ).default.cluster?.broadcastEval(
   (cl, { n }) =>
    cl.users?.cache.filter((u) => u.username?.toLowerCase().includes(n?.toLowerCase())),
   { context: { n: name } },
  )
 )?.flat() ?? [];
