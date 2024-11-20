import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';
import cache from '../../cache.js';
import error from '../../error.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';
import requestHandlerError from '../../requestHandlerError.js';
import { canGetCommands } from './getGlobalCommand.js';
import { makeRequestHandler } from '../../requestHandler.js';

/**
 * Overwrites all existing global commands for this application in this guild.
 * @param guild - The guild to overwrite the commands for.
 * @param body - The commands to overwrite.
 * @returns A promise that resolves with an array of the newly created application commands.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPutAPIApplicationGuildCommandsJSONBody,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');
 if (!canGetCommands(guild)) {
  const e = requestHandlerError(
   `Cannot get own Commands. Please make sure you don't have more than 50 Bots in your Server`,
   [],
  );

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 if (
  (await getBotIdFromGuild(guild)) !== guild.client.user.id &&
  !cache.apis.get(guild.id) &&
  !(await makeRequestHandler(guild))
 ) {
  return new Error('Failed to set up API');
 }

 return (cache.apis.get(guild.id) ?? API).applicationCommands
  .bulkOverwriteGuildCommands(await getBotIdFromGuild(guild), guild.id, body)
  .then((cmds) => {
   const parsed = cmds.map(
    (cmd) => new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id),
   );
   cache.commands.cache.set(guild.id, new Map());
   guild.commands.cache.clear();

   parsed.forEach((p) => {
    cache.commands.cache.get(guild.id)?.set(p.id, p);

    if (cache.apis.get(guild.id)) return;
    guild.commands.cache.set(p.id, p);
   });

   return parsed;
  })
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
};

/**
 * Checks if a guild has missing scopes for commands.
 * @param guild - The Discord guild to check.
 * @returns A promise that resolves to the guild with missing scopes,
 * or undefined if no guild is found.
 */
export const hasMissingScopes = (guild: Discord.Guild) =>
 guild.client.util.DataBase.noCommandsGuilds.findUnique({
  where: { guildId: guild.id },
 });

/**
 * Sets the "hasMissingScopes" flag for a guild if the error message includes "Missing Access".
 * @param err - The error message.
 * @param guild - The Discord guild.
 */
export const setHasMissingScopes = (err: string, guild: Discord.Guild) => {
 if (!err.includes('Missing Access')) return;

 guild.client.util.DataBase.noCommandsGuilds
  .upsert({
   where: { guildId: guild.id },
   create: { guildId: guild.id },
   update: {},
  })
  .then();
};
