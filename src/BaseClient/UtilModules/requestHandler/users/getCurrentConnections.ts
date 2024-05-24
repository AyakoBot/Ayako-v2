import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import error from '../../error.js';

/**
 * Returns the current connections of the users in the specified guild.
 * If the connections cannot be retrieved, logs an error and returns the error object.
 * @param guild - The guild to retrieve the connections for.
 * @param saveGuild - The guild to use if guild is not defined.
 * @returns A promise that resolves to an array of user connections or an error object.
 */
function fn(
 guild: undefined | null | Discord.Guild,
 saveGuild: Discord.Guild,
): Promise<Discord.RESTGetAPICurrentUserConnectionsResult | Discord.DiscordAPIError>;
function fn(
 guild: Discord.Guild,
 saveGuild?: undefined,
): Promise<Discord.RESTGetAPICurrentUserConnectionsResult | Discord.DiscordAPIError>;
async function fn(
 guild: undefined | null | Discord.Guild,
 saveGuild?: Discord.Guild,
): Promise<Discord.RESTGetAPICurrentUserConnectionsResult | Discord.DiscordAPIError> {
 const g = (guild ?? saveGuild)!;

 return (cache.apis.get(g.id) ?? API).users.getConnections().catch((e) => {
  error(guild, e);
  return e as Discord.DiscordAPIError;
 });
}

export default fn;
