import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Retrieves the invites for a given guild-based channel.
 * @param channel - The guild-based channel to retrieve invites for.
 * @returns A promise that resolves with an array of parsed invite objects.
 */
export default async (channel: Discord.GuildBasedChannel) => {
 if (!canGetInvites(channel, await getBotMemberFromGuild(channel.guild))) {
  const e = requestHandlerError(`Cannot get invites in ${channel.name} / ${channel.id}`, [
   Discord.PermissionFlagsBits.ManageChannels,
  ]);

  error(channel.guild, e);
  return e;
 }

 return (channel.guild ? cache.apis.get(channel.guild.id) ?? API : API).channels
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
};

/**
 * Checks if the user has permission to get invites in a guild-based channel.
 * @param channel - The guild-based channel to check permissions in.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user has permission to get invites.
 */
export const canGetInvites = (channel: Discord.GuildBasedChannel, me: Discord.GuildMember) =>
 me.permissionsIn(channel).has(Discord.PermissionFlagsBits.ManageChannels);
