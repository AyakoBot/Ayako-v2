import * as Discord from 'discord.js';
import { API } from '../../../Client.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';
// eslint-disable-next-line import/no-cycle
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
export default async (guild: Discord.Guild, commandId: string) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .deleteGlobalCommand(await getBotIdFromGuild(guild), commandId)
  .then(() => {
   if (cache.apis.get(guild.id)) {
    cache.commands.set(
     guild.id,
     cache.commands.get(guild.id)!.filter((c) => c.id !== commandId),
    );

    if (cache.commands.get(guild.id)!.length > 0) return;
    cache.commands.delete(guild.id);
    return;
   }

   guild.client.application.commands.cache.delete(commandId);
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
