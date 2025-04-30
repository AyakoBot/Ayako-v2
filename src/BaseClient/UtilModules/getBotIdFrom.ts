import type { Guild } from 'src/Typings/Typings.js';
import DataBase from '../Bot/DataBase.js';
import cache from './cache.js';

/**
 * Extracts the bot ID from a Discord bot token.
 * @param t The Discord bot token.
 * @returns The bot ID.
 */
export const token = (t: string) => Buffer.from(t.split('.')[0], 'base64').toString();

/**
 * Returns the bot ID for a given guild.
 * @param g - The guild.
 * @returns The bot ID for the guild.
 */
export const guild = async (g: Guild | string) => {
 const gId = typeof g === 'string' ? g : g.id;
 if (!g) {
  const { clientUser } = await import('../Bot/Client.js');

  return clientUser.id;
 }

 const cached = cache.customClients.get(gId);
 if (cached) return cached;

 const settings = await DataBase.customclients.findUnique({
  where: { guildid: gId, token: { not: null } },
  select: { token: true },
 });

 const { clientUser } = await import('../Bot/Client.js');

 if (!settings || !settings.token) {
  cache.customClients.set(gId, clientUser.id);
  return clientUser.id;
 }

 const id = token(settings.token);
 cache.customClients.set(gId, id);

 return id;
};
