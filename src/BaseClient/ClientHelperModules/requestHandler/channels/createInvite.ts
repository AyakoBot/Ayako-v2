import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Creates an invite for a guild-based channel.
 * @param channel - The guild-based channel to create the invite for.
 * @param body - The invite data to send.
 * @param reason - The reason for creating the invite.
 * @returns A promise that resolves with the created invite or rejects with a DiscordAPIError.
 */
export default async (
 channel: Discord.GuildBasedChannel,
 body: Discord.RESTPostAPIChannelInviteJSONBody,
 reason?: string,
) =>
 (cache.apis.get(channel.guild.id) ?? API).channels
  .createInvite(channel.id, body, { reason })
  .then((i) => new Classes.Invite(channel.client, i))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
