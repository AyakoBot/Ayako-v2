import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';
import cache from '../../cache.js';
import error from '../../error.js';

/**
 * Deletes a global command from the Discord API and removes it from the cache.
 * @param guild - The guild where the command is registered.
 * @param commandId - The ID of the command to be deleted.
 * @returns A promise that resolves when the command is successfully deleted
 * and removed from the cache,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, commandId: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return (cache.apis.get(guild.id) ?? API).applicationCommands
  .deleteGlobalCommand(await getBotIdFromGuild(guild), commandId)
  .then(() => {
   cache.commands.delete(guild.id, commandId);
   guild.client.application.commands.cache.delete(commandId);
  })
  .catch((e) => {
   if (JSON.stringify(e).includes('Unknown application command')) {
    cache.commands.delete(guild.id, commandId);
    guild.client.application.commands.cache.delete(commandId);
    return true;
   }
   error(guild, e);
   return e as Discord.DiscordAPIError;
  });
};
