import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';

/**
 * Returns the current connections of the users in the specified guild.
 * If the connections cannot be retrieved, logs an error and returns the error object.
 * @param guild - The guild to retrieve the connections for.
 * @returns A promise that resolves to an array of user connections or an error object.
 */
export default async (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).users.getConnections().catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
