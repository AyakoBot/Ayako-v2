import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Edits a sticker in a guild.
 * @param guild The guild where the sticker is located.
 * @param stickerId The ID of the sticker to edit.
 * @param body The new data for the sticker.
 * @param reason The reason for editing the sticker.
 * @returns A promise that resolves with the edited sticker, or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 stickerId: string,
 body: Discord.RESTPatchAPIGuildStickerJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEditSticker(await guild.client.util.getBotMemberFromGuild(guild))) {
  const e = guild.client.util.requestHandlerError(`Cannot edit sticker ${stickerId}`, [
   Discord.PermissionFlagsBits.ManageGuildExpressions,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? API).guilds
  .editSticker(guild.id, stickerId, body, { reason })
  .then((s) => new Classes.Sticker(guild.client, s))
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
/**
 * Checks if the given guild member has permission to edit stickers.
 * @param me - The guild member to check.
 * @returns True if the guild member has permission to edit stickers, false otherwise.
 */
export const canEditSticker = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions);
