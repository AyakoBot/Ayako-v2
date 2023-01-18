import client from '../Client.js';

/**
 * Returns an emoji
 * @param idPair guildID:stringID
 */
export default (idPair: string) =>
  client.helpers.getEmoji(idPair.split(':')[0], idPair.split(':')[1]);
