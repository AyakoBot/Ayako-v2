import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
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
export default async (
 guild: Discord.Guild | undefined,
 client: Discord.Client<true>,
 query?: Discord.RESTGetAPIApplicationCommandsQuery,
) =>
 (guild ? (cache.apis.get(guild.id) ?? API) : API).applicationCommands
  .getGlobalCommands(guild ? await getBotIdFromGuild(guild) : client.user.id, query)
  .then((cmds) => {
   const parsed = cmds.map((cmd) => new Classes.ApplicationCommand(client, cmd));

   if (guild && !cache.commands.cache.get(guild.id)) cache.commands.cache.set(guild.id, new Map());
   parsed.forEach((p) => {
    if (guild) cache.commands.cache.get(guild.id)?.set(p.id, p);

    if (guild && cache.apis.get(guild.id)) return;

    client.application.commands.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
