import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Deletes a sticker from a guild.
 * @param guild The guild to delete the sticker from.
 * @param stickerId The ID of the sticker to delete.
 * @param reason The reason for deleting the sticker.
 * @returns A promise that resolves with the deleted sticker object if successful,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, stickerId: string, reason?: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDeleteSticker(await guild.client.util.getBotMemberFromGuild(guild))) {
  const e = guild.client.util.requestHandlerError(`Cannot delete sticker ${stickerId}`, [
   Discord.PermissionFlagsBits.ManageGuildExpressions,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).guilds
  .deleteSticker(guild.id, stickerId, { reason })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
/**
 * Checks if the given guild member has the permission to delete stickers.
 * @param me - The guild member to check.
 * @returns True if the guild member has the permission to delete stickers, false otherwise.
 */
export const canDeleteSticker = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions);
