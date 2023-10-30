import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Creates a direct message channel between the bot and the specified user.
 * @param guild The guild where the DM will be created.
 * @param userId The ID of the user to create the DM with.
 * @returns A promise that resolves with the created DM channel,
 * or rejects with a DiscordAPIError if the DM creation fails.
 */
export default (guild: Discord.Guild, userId: string) =>
 (cache.apis.get(guild.id) ?? API).users
  .createDM(userId)
  .then((c) => Classes.Channel<1>(guild.client, c, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
