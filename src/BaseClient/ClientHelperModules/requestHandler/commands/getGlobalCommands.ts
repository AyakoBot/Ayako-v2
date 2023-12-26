import * as Discord from 'discord.js';
import { API } from '../../../Client.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

/**
 * Retrieves the global slash commands for a guild.
 * @param guild - The guild to retrieve the commands for.
 * @param query - Optional query parameters to filter the commands.
 * @returns A Promise that resolves to an array of parsed ApplicationCommand objects.
 */
export default async (guild: Discord.Guild, query?: Discord.RESTGetAPIApplicationCommandsQuery) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .getGlobalCommands(await getBotIdFromGuild(guild), query)
  .then((cmds) => {
   const parsed = cmds.map((cmd) => new Classes.ApplicationCommand(guild.client, cmd));

   if (!cache.commands.cache.get(guild.id)) cache.commands.cache.set(guild.id, new Map());
   parsed.forEach((p) => {
    cache.commands.cache.get(guild.id)?.set(p.id, p);

    if (cache.apis.get(guild.id)) return;
    if (guild.client.application.commands.cache.get(p.id)) return;
    guild.client.application.commands.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
