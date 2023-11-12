import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Deletes an emoji from a guild.
 * @param guild - The guild where the emoji is located.
 * @param emojiId - The ID of the emoji to delete.
 * @param reason - The reason for deleting the emoji.
 * @returns A promise that resolves with the deleted emoji, or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, emojiId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).guilds.deleteEmoji(guild.id, emojiId, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
