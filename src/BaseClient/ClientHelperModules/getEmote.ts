import client from '../Client.js';

/**
 * Returns an emoji
 * @param idPair guildID:stringID
 */
export default (idPair: string) =>
  client.emojis.cache.get(idPair.split(':')[1]);
