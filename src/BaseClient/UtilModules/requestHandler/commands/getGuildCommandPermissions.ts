import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';

/**
 * Retrieves the permissions for a specific command in a guild.
 * @param guild - The guild where the command is located.
 * @param commandId - The ID of the command to retrieve permissions for.
 * @returns A promise that resolves with the command permissions, or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, commandId: string) =>
 (guild.client.util.cache.apis.get(guild.id) ?? API).applicationCommands
  .getGuildCommandPermissions(await guild.client.util.getBotIdFromGuild(guild), guild.id, commandId)
  .then((res) => {
   guild.client.util.cache.commandPermissions.set(guild.id, commandId, res.permissions);
   return res.permissions;
  })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
