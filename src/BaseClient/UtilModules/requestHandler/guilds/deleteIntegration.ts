import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';

/**
 * Deletes an integration from a guild.
 * @param guild The guild to delete the integration from.
 * @param integrationId The ID of the integration to delete.
 * @param reason The reason for deleting the integration.
 * @returns A promise that resolves with the deleted integration if successful,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, integrationId: string, reason?: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDeleteIntegration(await guild.client.util.getBotMemberFromGuild(guild))) {
  const e = guild.client.util.requestHandlerError(`Cannot delete integration ${integrationId}`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? API).guilds
  .deleteIntegration(guild.id, integrationId, { reason })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
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
