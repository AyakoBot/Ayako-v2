import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Leaves the specified guild.
 * @param guild - The guild to leave.
 * @param client - Whether to use the main client
 * @returns A promise that resolves with the DiscordAPIError if an error occurs, otherwise void.
 */
export default async (guild: Discord.Guild, client: boolean = false) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return ((!client ? await getAPI(guild) : API) ?? API).users.leaveGuild(guild.id).catch((e: Discord.DiscordAPIError) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 });
};
