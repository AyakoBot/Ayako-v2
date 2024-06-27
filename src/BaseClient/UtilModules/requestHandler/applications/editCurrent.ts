import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import error from '../../error.js';

/**
 * Edits the current Application.
 * @param guild The Guild to get the Application from or undefined.
 * @param body The data to send in the request.
 * @returns A Promise that resolves with a DiscordAPIError if the application cannot be found or edited.
 */
export default async (
 guild: Discord.Guild | undefined,
 body: Parameters<typeof API.applications.editCurrent>[0],
) =>
 (guild ? cache.apis.get(guild.id) ?? API : API).applications.editCurrent(body).catch((e) => {
  if (guild) error(guild, e);
  return e as Discord.DiscordAPIError;
 });
