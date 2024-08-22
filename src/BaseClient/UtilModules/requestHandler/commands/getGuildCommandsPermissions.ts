import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import error, { sendDebugMessage } from '../../error.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';
import requestHandlerError from '../../requestHandlerError.js';
import { canGetCommands } from './getGlobalCommand.js';

/**
 * Retrieves the permissions for all the slash commands in a guild.
 * @param guild - The guild to retrieve the permissions for.
 * @returns A promise that resolves to the permissions for all the slash commands in the guild.
 */
export default async (guild: Discord.Guild) => {
 if (!canGetCommands(guild)) {
  const e = requestHandlerError(
   `Cannot get own Commands. Please make sure you don't have more than 50 Bots in your Server`,
   [],
  );

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).applicationCommands
  .getGuildCommandsPermissions(await getBotIdFromGuild(guild), guild.id)
  .then((res) => {
   res.forEach((r) => {
    cache.commandPermissions.set(guild.id, r.id, r.permissions);
    return r.permissions;
   });

   return res;
  })
  .catch((e) => {
   if (e.message.includes('Missing Access')) return e as Discord.DiscordAPIError;
   sendDebugMessage({ content: `${canGetCommands(guild)}- ${guild.id}` });
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
