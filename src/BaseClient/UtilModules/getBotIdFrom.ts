import * as Discord from 'discord.js';
import DataBase from '../Bot/DataBase.js';

/**
 * Extracts the bot ID from a Discord bot token.
 * @param t The Discord bot token.
 * @returns The bot ID.
 */
export const token = (t: string) => Buffer.from(t.split('.')[0], 'base64').toString();

/**
 * Returns the bot ID for a given guild.
 * @param g - The Discord guild object.
 * @returns The bot ID for the guild.
 */
export const guild = async (g: Discord.Guild) => {
 if (!g) {
  const { default: client } = await import('../../BaseClient/Bot/Client.js');

  return client.user!.id;
 }

 const settings = await DataBase.customclients.findUnique({
  where: { guildid: g.id, token: { not: null } },
  select: { token: true },
 });
 if (!settings) return g.client.user.id;
 if (!settings.token) return g.client.user.id;

 return token(settings.token) ?? g.client.user.id;
};
