import * as Discord from 'discord.js';
import { API } from '../../../Client.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

/**
 * Creates a new guild command for the specified guild.
 * @param guild The guild to create the command for.
 * @param body The JSON body of the command.
 * @returns A promise that resolves with the created command.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIApplicationGuildCommandsJSONBody,
) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .createGuildCommand(await getBotIdFromGuild(guild), guild.id, body)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id);
   if (cache.apis.get(guild.id)) {
    if (!cache.commands.get(guild.id)) cache.commands.set(guild.id, [parsed]);
    else cache.commands.set(guild.id, cache.commands.get(guild.id)!.concat(parsed));

    return parsed;
   }

   guild.commands.cache.set(cmd.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
