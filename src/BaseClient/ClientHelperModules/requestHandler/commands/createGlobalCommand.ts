import * as Discord from 'discord.js';
import { API } from '../../../Client.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';
// eslint-disable-next-line import/no-cycle
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

/**
 * Creates a global command for the given guild.
 * @param guild - The guild to create the command for.
 * @param body - The REST API JSON body for the command.
 * @returns A Promise that resolves with the created ApplicationCommand object,
 * or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, body: Discord.RESTPostAPIApplicationCommandsJSONBody) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .createGlobalCommand(await getBotIdFromGuild(guild), body)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd);

   if (cache.apis.get(guild.id)) {
    if (!cache.commands.get(guild.id)) cache.commands.set(guild.id, [parsed]);
    else cache.commands.set(guild.id, cache.commands.get(guild.id)!.concat(parsed));

    return parsed;
   }

   if (guild.client.application.commands.cache.get(parsed.id)) return parsed;
   guild.client.application.commands.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
