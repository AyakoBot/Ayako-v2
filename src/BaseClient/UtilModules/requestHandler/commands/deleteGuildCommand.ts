import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';
import cache from '../../cache.js';
import error from '../../error.js';
import requestHandlerError from '../../requestHandlerError.js';
import { canGetCommands } from './getGlobalCommand.js';
import { hasMissingScopes, setHasMissingScopes } from './bulkOverwriteGuildCommands.js';

/**
 * Deletes a guild command from the Discord API and removes it from the guild's command cache.
 * @param guild The guild where the command is located.
 * @param commandId The ID of the command to be deleted.
 * @returns A promise that resolves when the command is successfully deleted,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, commandId: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');
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
  .deleteGuildCommand(await getBotIdFromGuild(guild), guild.id, commandId)
  .then(() => {
   cache.commands.delete(guild.id, commandId);
   guild.commands.cache.delete(commandId);
  })
  .catch((e) => {
   setHasMissingScopes(e.message, guild);

   if (JSON.stringify(e).includes('Unknown application command')) {
    cache.commands.delete(guild.id, commandId);
    guild.commands.cache.delete(commandId);
    return true;
   }
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
