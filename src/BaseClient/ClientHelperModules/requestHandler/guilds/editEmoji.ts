import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Edits a guild emoji.
 * @param guild The guild where the emoji is located.
 * @param emojiId The ID of the emoji to edit.
 * @param body The new data for the emoji.
 * @param reason The reason for editing the emoji.
 * @returns A promise that resolves with the edited guild emoji, or rejects with a DiscordAPIError.
 */
export default (
 guild: Discord.Guild,
 emojiId: string,
 body: Discord.RESTPatchAPIGuildEmojiJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .editEmoji(guild.id, emojiId, body, { reason })
  .then((e) => new Classes.GuildEmoji(guild.client, e, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
