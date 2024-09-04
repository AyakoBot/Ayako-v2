import * as Discord from 'discord.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Returns the current connections of the users in the specified guild.
 * If the connections cannot be retrieved, logs an error and returns the error object.
 * @param guild - The guild to retrieve the connections for.
 * @returns A promise that resolves to an array of user connections or an error object.
 */
export default async (
 guild: Discord.Guild,
): Promise<Discord.RESTGetAPICurrentUserConnectionsResult | Discord.DiscordAPIError> =>
 (await getAPI(guild)).users.getConnections().catch((e: Discord.DiscordAPIError) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 });
