import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Overwrites all existing global commands for this application in this guild.
 * @param guild - The guild to overwrite the commands for.
 * @param body - The commands to overwrite.
 * @returns A promise that resolves with an array of the newly created application commands.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPutAPIApplicationGuildCommandsJSONBody,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return (guild.client.util.cache.apis.get(guild.id) ?? API).applicationCommands
  .bulkOverwriteGuildCommands(await guild.client.util.getBotIdFromGuild(guild), guild.id, body)
  .then((cmds) => {
   const parsed = cmds.map(
    (cmd) => new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id),
   );
   guild.client.util.cache.commands.cache.set(guild.id, new Map());
   guild.commands.cache.clear();

   parsed.forEach((p) => {
    guild.client.util.cache.commands.cache.get(guild.id)?.set(p.id, p);

    if (guild.client.util.cache.apis.get(guild.id)) return;
    guild.commands.cache.set(p.id, p);
   });

   return parsed;
  })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
