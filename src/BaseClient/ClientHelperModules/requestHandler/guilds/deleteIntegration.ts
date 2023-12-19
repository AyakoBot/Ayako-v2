import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Deletes an integration from a guild.
 * @param guild The guild to delete the integration from.
 * @param integrationId The ID of the integration to delete.
 * @param reason The reason for deleting the integration.
 * @returns A promise that resolves with the deleted integration if successful,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, integrationId: string, reason?: string) => {
 if (!canDeleteIntegration(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(
   `Cannot delete integration ${integrationId} in ${guild.name} / ${guild.id}`,
   [Discord.PermissionFlagsBits.ManageGuild],
  );

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .deleteIntegration(guild.id, integrationId, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the permission to delete integrations.
 * @param me - The guild member to check.
 * @returns A boolean indicating whether the guild member can delete integrations.
 */
export const canDeleteIntegration = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
