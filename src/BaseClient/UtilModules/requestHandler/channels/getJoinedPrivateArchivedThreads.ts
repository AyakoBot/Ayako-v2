import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from './addReaction.js';

/**
 * Retrieves the joined private archived threads for a given channel.
 * @param channel - The channel to retrieve the threads for.
 * @param query - The query parameters for the request.
 * @returns A promise that resolves with an array of parsed thread channels.
 */
export default async (
 channel: Discord.NewsChannel | Discord.TextChannel | Discord.ForumChannel,
 query: Discord.RESTGetAPIChannelThreadsArchivedQuery,
) => {
 if (!canGetjoinedPrivateArchivedThreads(channel.id, await getBotMemberFromGuild(channel.guild))) {
  const e = requestHandlerError(
   `Cannot get joined private archived threads in ${channel.name} / ${channel.id}`,
   [Discord.PermissionFlagsBits.ReadMessageHistory],
  );

  error(channel.guild, e);
  return e;
 }

 return (await getAPI(channel.guild)).channels
  .getJoinedPrivateArchivedThreads(channel.id, query)
  .then((res) => {
   const parsed = res.threads.map((t) => Classes.Channel<10>(channel.client, t, channel.guild));
   parsed.forEach((p) => {
    if (channel.threads.cache.get(p.id)) return;
    channel.threads.cache.set(
     p.id,
     p as Discord.PublicThreadChannel<false> & Discord.ForumThreadChannel,
    );
   });
   return parsed;
  })
  .catch((e: Discord.DiscordAPIError) => {
   error(channel.guild, e);
   return e;
  });
};

/**
 * Checks if the user has permission to get joined private archived threads.
 * @param channelId - The ID of the guild-based channel to check permissions in.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user has the required permissions permissions.
 */
export const canGetjoinedPrivateArchivedThreads = (channelId: string, me: Discord.GuildMember) =>
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ReadMessageHistory);
