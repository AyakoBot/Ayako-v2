import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Creates a global command for the given guild.
 * @param guild - The guild to create the command for.
 * @param body - The REST API JSON body for the command.
 * @returns A Promise that resolves with the created ApplicationCommand object,
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIApplicationCommandsJSONBody,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return (guild.client.util.cache.apis.get(guild.id) ?? API).applicationCommands
  .createGlobalCommand(await guild.client.util.getBotIdFromGuild(guild), body)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd);
   if (!guild.client.util.cache.commands.cache.get(guild.id)) {
    guild.client.util.cache.commands.cache.set(guild.id, new Map());
   }
   guild.client.util.cache.commands.cache.get(guild.id)?.set(parsed.id, parsed);

   if (guild.client.util.cache.apis.get(guild.id)) return parsed;
   guild.client.application.commands.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
