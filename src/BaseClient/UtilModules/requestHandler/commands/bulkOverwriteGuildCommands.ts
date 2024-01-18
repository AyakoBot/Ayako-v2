import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

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

 return (cache.apis.get(guild.id) ?? API).applicationCommands
  .bulkOverwriteGuildCommands(await getBotIdFromGuild(guild), guild.id, body)
  .then((cmds) => {
   const parsed = cmds.map(
    (cmd) => new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id),
   );
   cache.commands.cache.set(guild.id, new Map());
   guild.commands.cache.clear();

   parsed.forEach((p) => {
    cache.commands.cache.get(guild.id)?.set(p.id, p);

    if (cache.apis.get(guild.id)) return;
    guild.commands.cache.set(p.id, p);
   });

   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
