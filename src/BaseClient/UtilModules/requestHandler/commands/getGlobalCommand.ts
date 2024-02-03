import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves a global command from the cache or from the Discord API.
 * @param guild - The guild where the command is located.
 * @param commandId - The ID of the command to retrieve.
 * @returns A Promise that resolves with the retrieved command or rejects with an error.
 */
export default async (guild: Discord.Guild, commandId: string) =>
 guild.client.application.commands.cache.get(commandId) ??
 guild.client.util.cache.commands.cache.get(guild.id)?.get(commandId) ??
 (guild.client.util.cache.apis.get(guild.id) ?? API).applicationCommands
  .getGlobalCommand(await guild.client.util.getBotIdFromGuild(guild), commandId)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd);
   if (!guild.client.util.cache.commands.cache.get(guild.id)) {
    guild.client.util.cache.commands.cache.set(guild.id, new Map());
   }
   guild.client.util.cache.commands.cache.get(guild.id)?.set(parsed.id, parsed);

   if (guild.client.util.cache.apis.get(guild.id)) return parsed;
   if (guild.client.application.commands.cache.get(parsed.id)) return parsed;
   guild.client.application.commands.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
