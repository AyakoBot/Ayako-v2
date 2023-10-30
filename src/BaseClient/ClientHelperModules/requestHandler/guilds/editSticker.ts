import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Edits a sticker in a guild.
 * @param guild The guild where the sticker is located.
 * @param stickerId The ID of the sticker to edit.
 * @param body The new data for the sticker.
 * @param reason The reason for editing the sticker.
 * @returns A promise that resolves with the edited sticker, or rejects with a DiscordAPIError.
 */
export default (
 guild: Discord.Guild,
 stickerId: string,
 body: Discord.RESTPatchAPIGuildStickerJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .editSticker(guild.id, stickerId, body, { reason })
  .then((s) => new Classes.Sticker(guild.client, s))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
