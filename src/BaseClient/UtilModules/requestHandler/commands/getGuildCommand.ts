import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

/**
 * Retrieves a guild command by ID from the cache or API.
 * @param guild The guild where the command is located.
 * @param commandId The ID of the command to retrieve.
 * @returns A Promise that resolves with the retrieved command, or rejects with an error.
 */
export default async (guild: Discord.Guild, commandId: string) =>
 guild.commands.cache.get(commandId) ??
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .getGuildCommand(await getBotIdFromGuild(guild), guild.id, commandId)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id);
   if (!cache.commands.cache.get(guild.id)) cache.commands.cache.set(guild.id, new Map());
   cache.commands.cache.get(guild.id)?.set(parsed.id, parsed);

   if (cache.apis.get(guild.id)) return parsed;
   guild.commands.cache.set(cmd.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, e);
   return e as Discord.DiscordAPIError;
  });
