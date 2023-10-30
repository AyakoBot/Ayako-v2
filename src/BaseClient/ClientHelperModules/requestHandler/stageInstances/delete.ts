import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Deletes a stage instance in a guild's voice channel.
 * @param guild - The guild where the stage instance is located.
 * @param channelId - The ID of the voice channel where the stage instance is located.
 * @param reason - The reason for deleting the stage instance.
 * @returns A promise that resolves with the deleted stage instance,
 * or rejects with a DiscordAPIError.
 */
export default (guild: Discord.Guild, channelId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).stageInstances.delete(channelId, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
