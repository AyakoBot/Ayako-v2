import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Creates a new sticker for the given guild.
 * @param guild The guild to create the sticker in.
 * @param body The sticker data to send in the request.
 * @param body.file The sticker image to upload.
 * @param reason The reason for creating the sticker.
 * @returns A promise that resolves with the created sticker, or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body: Omit<Discord.RESTPostAPIGuildStickerFormDataBody, 'file'> & {
  file: Discord.RawFile;
 },
 reason?: string,
) => {
 if (!canCreateSticker(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot create sticker in ${guild.name} / ${guild.id}`, [
   Discord.PermissionFlagsBits.ManageGuildExpressions,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .createSticker(guild.id, body, { reason })
  .then((s) => new Classes.Sticker(guild.client, s))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

// TODO: CreateGuildExpressions should be coming to D.js soon.
/**
 * Checks if the given guild member has the permission to create an sticker.
 * @param me - The guild member to check.
 * @returns True if the guild member has the permission to create an sticker, false otherwise.
 */
export const canCreateSticker = (me: Discord.GuildMember) =>
 me.permissions.has(8796093022208n) ||
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions);
