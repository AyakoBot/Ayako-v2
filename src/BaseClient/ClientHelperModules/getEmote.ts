/**
 * Returns an emoji
 * @param idPair guildID:stringID
 */
export default async (idPair: string) => {
  const client = (await import('../Client.js')).default;

  return client.emojis.cache.get(idPair.split(':')[1]);
};
