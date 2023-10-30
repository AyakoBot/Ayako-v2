import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the invites for a given guild-based channel.
 * @param channel - The guild-based channel to retrieve invites for.
 * @returns A promise that resolves with an array of parsed invite objects.
 */
export default (channel: Discord.GuildBasedChannel) =>
 (channel.guild ? cache.apis.get(channel.guild.id) ?? API : API).channels
  .getInvites(channel.id)
  .then((invites) => {
   const parsed = invites.map((i) => new Classes.Invite(channel.client, i));
   parsed.forEach((p) => {
    if (channel.guild.invites.cache.get(p.code)) return;
    channel.guild.invites.cache.set(p.code, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
