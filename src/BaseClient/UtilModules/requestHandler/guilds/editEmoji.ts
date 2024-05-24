import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Edits a guild emoji.
 * @param guild The guild where the emoji is located.
 * @param emojiId The ID of the emoji to edit.
 * @param body The new data for the emoji.
 * @param reason The reason for editing the emoji.
 * @returns A promise that resolves with the edited guild emoji, or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 emojiId: string,
 body: Discord.RESTPatchAPIGuildEmojiJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEditEmoji(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot edit emoji ${emojiId}`, [
   Discord.PermissionFlagsBits.ManageGuildExpressions,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .editEmoji(guild.id, emojiId, body, { reason })
  .then((e) => new Classes.GuildEmoji(guild.client, e, guild))
  .catch((e) => {
   error(guild, e);
   return e as Discord.DiscordAPIError;
  });
};
/**
 * Checks if the given guild member has permission to edit emojis.
 * @param me - The guild member to check.
 * @returns True if the guild member has permission to edit emojis, false otherwise.
 */
export const canEditEmoji = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions);
