import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Overwrites all global application commands for a guild.
 * @param guild - The guild to overwrite the commands for.
 * @param body - The JSON body containing the new commands.
 * @returns A promise that resolves with an array of the newly created application commands.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPutAPIApplicationCommandsJSONBody,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return (guild.client.util.cache.apis.get(guild.id) ?? API).applicationCommands
  .bulkOverwriteGlobalCommands(await guild.client.util.getBotIdFromGuild(guild), body)
  .then((cmds) => {
   const parsed = cmds.map((cmd) => new Classes.ApplicationCommand(guild.client, cmd));
   guild.client.util.cache.commands.cache.set(guild.id, new Map());

   parsed.forEach((p) => {
    guild.client.util.cache.commands.cache.get(guild.id)?.set(p.id, p);
   });

   parsed.forEach((p) => guild.client.application.commands.cache.set(p.id, p));
   return parsed;
  })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
