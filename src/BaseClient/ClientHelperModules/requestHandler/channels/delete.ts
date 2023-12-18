import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Deletes a channel from the given guild.
 * @param guild - The guild where the channel is located.
 * @param channelId - The ID of the channel to delete.
 * @returns A promise that resolves with the deleted channel, or rejects with a DiscordAPIError.
 */
export default async (channel: Discord.GuildBasedChannel) => {
 if (!isDeleteable(channel, await getBotMemberFromGuild(channel.guild))) {
  const e = requestHandlerError(`Cannot delete channel ${channel.name} / ${channel.id}`, [
   [Discord.ChannelType.PrivateThread, Discord.ChannelType.PublicThread].includes(channel.type)
    ? Discord.PermissionFlagsBits.ManageThreads
    : Discord.PermissionFlagsBits.ManageChannels,
  ]);

  error(channel.guild, e);
  return e;
 }

 return (cache.apis.get(channel.guild.id) ?? API).channels
  .delete(channel.id)
  .then((c) => Classes.Channel(channel.guild.client, c, channel.guild))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
/**
 * Checks if a channel is deleteable based on the permissions of the user.
 * @param channel - The channel to check.
 * @param me - The user's guild member object.
 * @returns A boolean indicating whether the channel is deleteable.
 */
export const isDeleteable = (channel: Discord.GuildBasedChannel, me: Discord.GuildMember) =>
 [Discord.ChannelType.PrivateThread, Discord.ChannelType.PublicThread].includes(channel.type)
  ? me.permissionsIn(channel).has(Discord.PermissionFlagsBits.ManageThreads)
  : me.permissionsIn(channel).has(Discord.PermissionFlagsBits.ManageChannels);
