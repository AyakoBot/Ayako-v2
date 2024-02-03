import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Creates a new guild command for the specified guild.
 * @param guild The guild to create the command for.
 * @param body The JSON body of the command.
 * @returns A promise that resolves with the created command.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIApplicationGuildCommandsJSONBody,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return (guild.client.util.cache.apis.get(guild.id) ?? API).applicationCommands
  .createGuildCommand(await guild.client.util.getBotIdFromGuild(guild), guild.id, body)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id);
   if (!guild.client.util.cache.commands.cache.get(guild.id)) {
    guild.client.util.cache.commands.cache.set(guild.id, new Map());
   }
   guild.client.util.cache.commands.cache.get(guild.id)?.set(parsed.id, parsed);

   if (guild.client.util.cache.apis.get(guild.id)) return parsed;
   guild.commands.cache.set(cmd.id, parsed);
   return parsed;
  })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
