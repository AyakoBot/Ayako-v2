import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Shows typing indicator in the given guild text-based channel.
 * @param channel - The guild text-based channel to show typing indicator in.
 * @returns A promise that resolves when the typing indicator is successfully shown,
 * or rejects with an error.
 */
export default (channel: Discord.GuildTextBasedChannel) =>
 (cache.apis.get(channel.guild.id) ?? API).channels.showTyping(channel.id).catch((e) => {
  error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
 });
