import * as Discord from 'discord.js';
import { API } from '../../../Client.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';
// eslint-disable-next-line import/no-cycle
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

/**
 * Retrieves the guild commands for a given guild.
 * @param guild The guild to retrieve the commands for.
 * @param query Optional query parameters to include in the request.
 * @returns A Promise that resolves with an array of parsed ApplicationCommand objects.
 */
export default async (
 guild: Discord.Guild,
 query?: Discord.RESTGetAPIApplicationGuildCommandsQuery,
) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .getGuildCommands(await getBotIdFromGuild(guild), guild.id, query)
  .then((cmds) => {
   const parsed = cmds.map(
    (cmd) => new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id),
   );
   parsed.forEach((p) => {
    if (cache.apis.get(guild.id)) {
     if (!cache.commands.get(guild.id)) cache.commands.set(guild.id, [p]);
     else cache.commands.set(guild.id, cache.commands.get(guild.id)!.concat(p));

     return;
    }

    if (guild.commands.cache.get(p.id)) return;
    guild.commands.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
