import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the pinned messages in a guild text-based channel.
 * @param channel - The guild text-based channel to retrieve pinned messages from.
 * @returns A promise that resolves with an array of parsed messages.
 */
export default async (channel: Discord.GuildTextBasedChannel) =>
 (channel.guild ? cache.apis.get(channel.guild.id) ?? API : API).channels
  .getPins(channel.id)
  .then((msgs) => {
   const parsed = msgs.map((msg) => new Classes.Message(channel.client, msg));
   parsed.forEach((p) => {
    if (channel.messages.cache.get(p.id)) return;
    channel.messages.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   console.log(JSON.stringify(e));
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
