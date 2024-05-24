import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Creates a new emoji for the specified guild.
 * @param guild The guild to create the emoji in.
 * @param body The emoji data to create.
 * @param reason The reason for creating the emoji.
 * @returns A promise that resolves with the created GuildEmoji object,
 *  or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIGuildEmojiJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canCreateEmoji(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot create emoji`, [
   Discord.PermissionFlagsBits.ManageGuildExpressions,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .createEmoji(
   guild.id,
   {
    ...body,
    image: (await Discord.resolveImage(body.image)) as string,
   },
   { reason },
  )
  .then((e) => new Classes.GuildEmoji(guild.client, e, guild))
  .catch((e) => {
   error(guild, e);
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the permission to create an emoji.
 * @param me - The guild member to check.
 * @returns True if the guild member has the permission to create an emoji, false otherwise.
 */
export const canCreateEmoji = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.CreateGuildExpressions) ||
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions);
