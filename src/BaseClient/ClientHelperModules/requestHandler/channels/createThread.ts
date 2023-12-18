import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Creates a thread in a guild text-based channel.
 * @param channel - The guild text-based channel where the thread will be created.
 * @param body - The REST API JSON body for creating the thread.
 * @param messageId - The ID of the message to create the thread from.
 * @returns A promise that resolves with the created thread or rejects with a DiscordAPIError.
 */
export default async (
 channel: Discord.GuildTextBasedChannel,
 body: Discord.RESTPostAPIChannelThreadsJSONBody,
 messageId?: string,
) => {
 if (!canCreateThread(channel, body, await getBotMemberFromGuild(channel.guild))) {
  const e = requestHandlerError(
   `Cannot create ${
    body.type === Discord.ChannelType.PrivateThread ? 'private' : 'public'
   } threads in ${channel.name} / ${channel.id}`,
   [
    body.type === Discord.ChannelType.PublicThread
     ? Discord.PermissionFlagsBits.CreatePublicThreads
     : Discord.PermissionFlagsBits.CreatePrivateThreads,
   ],
  );

  error(channel.guild, e);
  return e;
 }

 return (cache.apis.get(channel.guild.id) ?? API).channels
  .createThread(channel.id, body, messageId)
  .then((t) => Classes.Channel<10>(channel.client, t, channel.guild))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given user has permission to create a thread in the specified channel.
 * @param channel - The guild text-based channel to check.
 * @param me - The guild member representing the user.
 * @returns True if the user has permission to create a thread, false otherwise.
 */
export const canCreateThread = (
 channel: Discord.GuildTextBasedChannel,
 body: Discord.RESTPostAPIChannelThreadsJSONBody,
 me: Discord.GuildMember,
) =>
 body.type === Discord.ChannelType.PublicThread
  ? me.permissionsIn(channel).has(Discord.PermissionFlagsBits.CreatePublicThreads)
  : me.permissionsIn(channel).has(Discord.PermissionFlagsBits.CreatePrivateThreads);
