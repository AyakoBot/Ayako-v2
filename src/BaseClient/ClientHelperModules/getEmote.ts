/**
 * Retrieves an emoji from the cache by its ID.
 * @param idPair - The ID pair of the emoji in the format `guildID:emojiID`.
 * @returns The emoji object if found, otherwise `undefined`.
 */
export default async (idPair: string) => {
 const client = (await import('../Client.js')).default;

 const response = await client.shard?.broadcastEval((c, { id }) => c.emojis.cache.get(id), {
  context: { id: idPair.split(':').at(-1) as string },
 });

 return response?.find((e) => !!e);
};
