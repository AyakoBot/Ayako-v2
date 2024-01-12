import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Deletes a stage instance in a guild's voice channel.
 * @param guild - The guild where the stage instance is located.
 * @param channelId - The ID of the voice channel where the stage instance is located.
 * @param reason - The reason for deleting the stage instance.
 * @returns A promise that resolves with the deleted stage instance,
 * or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, channelId: string, reason?: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDelete(await getBotMemberFromGuild(guild), channelId)) {
  const e = requestHandlerError(`Cannot delete stage instance`, [
   Discord.PermissionFlagsBits.ManageChannels,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).stageInstances
  .delete(channelId, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the permission to delete stage instances.
 * @param me - The Discord guild member.
 * @param channelId - The ID of the voice channel where the stage instance is located.
 * @returns A boolean indicating whether the guild member can delete stage instances.
 */
export const canDelete = (me: Discord.GuildMember, channelId: string) =>
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageChannels);
