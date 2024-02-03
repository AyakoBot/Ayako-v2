import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';

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
 (guild ? guild.client.util.cache.apis.get(guild.id) ?? API : API).applicationCommands
  .getGlobalCommands(
   guild ? await guild.client.util.getBotIdFromGuild(guild) : client.user.id,
   query,
  )
  .then((cmds) => {
   const parsed = cmds.map((cmd) => new Classes.ApplicationCommand(client, cmd));

   if (guild && !guild.client.util.cache.commands.cache.get(guild.id)) {
    guild.client.util.cache.commands.cache.set(guild.id, new Map());
   }
   parsed.forEach((p) => {
    if (guild) guild.client.util.cache.commands.cache.get(guild.id)?.set(p.id, p);

    if (guild && guild.client.util.cache.apis.get(guild.id)) return;

    client.application.commands.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   if (guild) guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
