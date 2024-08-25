import * as Discord from 'discord.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from './addReaction.js';

/**
 * Edits a permission overwrite for a guild-based channel.
 * @param channel - The guild-based channel to edit the permission overwrite for.
 * @param overwriteId - The ID of the permission overwrite to edit.
 * @param body - The new permission overwrite data.
 * @param reason - The reason for editing the permission overwrite.
 * @returns A promise that resolves with the updated permission overwrite,
 * or rejects with a DiscordAPIError.
 */
export default async (
 channel: Discord.GuildBasedChannel,
 overwriteId: string,
 body: Discord.RESTPutAPIChannelPermissionJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (
  !canEditPermissionOverwrite(
   channel.id,
   body,
   overwriteId,
   await getBotMemberFromGuild(channel.guild),
  )
 ) {
  const e = requestHandlerError(
   `Cannot edit permission overwrite in ${channel.name} / ${channel.id}`,
   [Discord.PermissionFlagsBits.ManageRoles],
  );

  return e;
 }

 return (await getAPI(channel.guild)).channels
  .editPermissionOverwrite(channel.id, overwriteId, body, { reason })
  .catch((e) => {
   error(channel.guild, e);
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the user can edit a permission overwrite in a guild-based channel.
 * @param channelId - The ID of the guild-based channel.
 * @param body - The JSON body of the REST API request to edit the permission overwrite.
 * @param overwriteId - The ID of the permission overwrite.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user can edit the permission overwrite.
 */
export const canEditPermissionOverwrite = (
 channelId: string,
 body: Discord.RESTPutAPIChannelPermissionJSONBody,
 overwriteId: string,
 me: Discord.GuildMember,
) =>
 me.guild.ownerId === me.id ||
 (me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageRoles) &&
  (overwriteId === me.id
   ? me.permissionsIn(channelId).has(body.allow ? BigInt(body.allow) : 0n)
   : true));
