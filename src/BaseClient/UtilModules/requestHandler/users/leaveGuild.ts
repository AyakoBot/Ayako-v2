import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';

/**
 * Leaves the specified guild.
 * @param guild - The guild to leave.
 * @returns A promise that resolves with the DiscordAPIError if an error occurs, otherwise void.
 */
export default async (guild: Discord.Guild) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return (cache.apis.get(guild.id) ?? API).users.leaveGuild(guild.id).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
};
