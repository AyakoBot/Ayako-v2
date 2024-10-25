import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import error from '../../error.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';
import requestHandlerError from '../../requestHandlerError.js';
import { canGetCommands } from './getGlobalCommand.js';
import { hasMissingScopes, setHasMissingScopes } from './bulkOverwriteGuildCommands.js';

/**
 * Retrieves the permissions for a specific command in a guild.
 * @param guild - The guild where the command is located.
 * @param commandId - The ID of the command to retrieve permissions for.
 * @returns A promise that resolves with the command permissions, or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, commandId: string) => {
 if (!canGetCommands(guild)) {
  const e = requestHandlerError(
   `Cannot get own Commands. Please make sure you don't have more than 50 Bots in your Server`,
   [],
  );

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 if (await hasMissingScopes(guild)) return [];

 return (cache.apis.get(guild.id) ?? API).applicationCommands
  .getGuildCommandPermissions(await getBotIdFromGuild(guild), guild.id, commandId)
  .then((res) => {
   cache.commandPermissions.set(guild.id, commandId, res.permissions);
   return res.permissions;
  })
  .catch((e: Discord.DiscordAPIError) => {
   setHasMissingScopes(e.message, guild);
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
};
