import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
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
 cache.commands.cache.get(guild.id)?.get(commandId) ??
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .getGlobalCommand(await getBotIdFromGuild(guild), commandId)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd);
   if (!cache.commands.cache.get(guild.id)) cache.commands.cache.set(guild.id, new Map());
   cache.commands.cache.get(guild.id)?.set(parsed.id, parsed);

   if (cache.apis.get(guild.id)) return parsed;
   if (guild.client.application.commands.cache.get(parsed.id)) return parsed;
   guild.client.application.commands.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });

/**
 * Checks if the guild can get commands.
 * A guild can get commands if the number of bot members in the guild is less than or equal to 50.
 *
 * @param guild - The Discord guild to check.
 * @returns A boolean indicating whether the guild can get commands.
 */
export const canGetCommands = (guild: Discord.Guild) =>
 !(guild.members.cache.filter((m) => m.user.bot).size > 50);
