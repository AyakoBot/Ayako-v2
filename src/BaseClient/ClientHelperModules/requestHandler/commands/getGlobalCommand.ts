import * as Discord from 'discord.js';
import { API } from '../../../Client.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

/**
 * Retrieves a global command from the cache or from the Discord API.
 * @param guild - The guild where the command is located.
 * @param commandId - The ID of the command to retrieve.
 * @returns A Promise that resolves with the retrieved command or rejects with an error.
 */
export default async (guild: Discord.Guild, commandId: string) =>
 guild.client.application.commands.cache.get(commandId) ??
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .getGlobalCommand(await getBotIdFromGuild(guild), commandId)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd);
   if (cache.apis.get(guild.id)) {
    if (!cache.commands.get(guild.id)) cache.commands.set(guild.id, [parsed]);
    else cache.commands.set(guild.id, cache.commands.get(guild.id)!.concat(parsed));

    return parsed;
   }

   if (guild.client.application.commands.cache.get(parsed.id)) return parsed;
   guild.client.application.commands.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
