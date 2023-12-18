import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

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
) =>
 (cache.apis.get(channel.guild.id) ?? API).channels
  .editPermissionOverwrite(channel.id, overwriteId, body, { reason })
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

export const canEditPermissionOverwrite = (
 channel: Discord.GuildBasedChannel,
 body: Discord.RESTPutAPIChannelPermissionJSONBody,
 overwriteId: string,
 me: Discord.GuildMember,
) =>
 me.permissionsIn(channel).has(Discord.PermissionFlagsBits.ManageRoles) &&
 (overwriteId === me.id
  ? me.permissionsIn(channel).has(body.allow ? BigInt(body.allow) : 0n)
  : true);
