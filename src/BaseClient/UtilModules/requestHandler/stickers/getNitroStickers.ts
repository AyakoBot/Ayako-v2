import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';

/**
 * Retrieves Nitro stickers for a given guild.
 * @param guild - The guild to retrieve Nitro stickers for.
 * @returns A promise that resolves with the Nitro stickers, or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild) =>
 (guild.client.util.cache.apis.get(guild.id) ?? API).stickers.getNitroStickers().catch((e) => {
  guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
