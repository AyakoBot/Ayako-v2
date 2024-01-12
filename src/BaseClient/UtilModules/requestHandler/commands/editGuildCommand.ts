import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';
import cache from '../../cache.js';
import error from '../../error.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';

/**
 * Edits a guild command for a given guild.
 * @param guild The guild where the command is located.
 * @param commandId The ID of the command to edit.
 * @param body The new command data to update.
 * @returns A Promise that resolves with the updated command.
 */
export default async (
 guild: Discord.Guild,
 commandId: string,
 body: Discord.RESTPatchAPIApplicationGuildCommandJSONBody,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return (cache.apis.get(guild.id) ?? API).applicationCommands
  .editGuildCommand(await getBotIdFromGuild(guild), guild.id, commandId, body)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id);
   if (!cache.commands.cache.get(guild.id)) cache.commands.cache.set(guild.id, new Map());
   cache.commands.cache.get(guild.id)?.set(parsed.id, parsed);

   if (cache.apis.get(guild.id)) return parsed;
   guild.commands.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
