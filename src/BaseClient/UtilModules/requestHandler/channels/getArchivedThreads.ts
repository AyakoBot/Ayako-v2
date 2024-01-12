import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Retrieves a list of archived threads in a channel.
 * @param channel - The channel to retrieve archived threads from.
 * @param status - The status of the threads to retrieve. Can be either 'private' or 'public'.
 * @param query - The query parameters to include in the request.
 * @returns A Promise that resolves with an array of parsed thread objects.
 */
export default async (
 channel: Discord.NewsChannel | Discord.TextChannel | Discord.ForumChannel,
 status: 'private' | 'public',
 query: Discord.RESTGetAPIChannelThreadsArchivedQuery,
) => {
 if (!canGetArchivedThreads(channel.id, status, await getBotMemberFromGuild(channel.guild))) {
  const e = requestHandlerError(
   `Cannot get archived threads in ${channel.name} / ${channel.id}`,
   status === 'private'
    ? [Discord.PermissionFlagsBits.ManageThreads, Discord.PermissionFlagsBits.ReadMessageHistory]
    : [],
  );

  error(channel.guild, e);
  return e;
 }

 return (channel.guild ? cache.apis.get(channel.guild.id) ?? API : API).channels
  .getArchivedThreads(channel.id, status, query)
  .then((res) => {
   const parsed = res.threads.map((t) => Classes.Channel<10>(channel.client, t, channel.guild));
   parsed.forEach((p) => {
    if (channel.threads.cache.get(p.id)) return;
    channel.threads.cache.set(
     p.id,
     p as Discord.ThreadChannel<true> & Discord.ThreadChannel<false>,
    );
   });
   return parsed;
  })
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Determines whether the current user can get archived threads in a channel.
 * @param channelId - The ID of the channel in which the archived threads are being accessed.
 * @param status - The status of the archived threads ('private' or 'public').
 * @param me - The guild member representing the current user.
 * @returns A boolean value indicating whether the current user can get archived threads.
 */
export const canGetArchivedThreads = (
 channelId: string,
 status: 'private' | 'public',
 me: Discord.GuildMember,
) =>
 status === 'private'
  ? me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageThreads) &&
    me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ReadMessageHistory)
  : true;
