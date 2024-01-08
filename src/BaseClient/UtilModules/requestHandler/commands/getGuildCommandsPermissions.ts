import * as Discord from 'discord.js';
import { API } from '../../../Client.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';
import cache from '../../cache.js';
import error from '../../error.js';

/**
 * Retrieves the permissions for all the slash commands in a guild.
 * @param guild - The guild to retrieve the permissions for.
 * @returns A promise that resolves to the permissions for all the slash commands in the guild.
 */
export default async (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .getGuildCommandsPermissions(await getBotIdFromGuild(guild), guild.id)
  .then((res) => {
   res.forEach((r) => {
    cache.commandPermissions.set(guild.id, r.id, r.permissions);
    return r.permissions;
   });

   return res;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
