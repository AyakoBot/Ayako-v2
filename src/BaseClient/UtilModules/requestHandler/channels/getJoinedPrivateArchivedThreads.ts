import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';

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
 if (
  !canGetjoinedPrivateArchivedThreads(
   channel.id,
   await channel.client.util.getBotMemberFromGuild(channel.guild),
  )
 ) {
  const e = channel.client.util.requestHandlerError(
   `Cannot get joined private archived threads in ${channel.name} / ${channel.id}`,
   [Discord.PermissionFlagsBits.ReadMessageHistory],
  );

  channel.client.util.error(channel.guild, e);
  return e;
 }

 return (channel.guild ? channel.client.util.cache.apis.get(channel.guild.id) ?? API : API).channels
  .getJoinedPrivateArchivedThreads(channel.id, query)
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
   channel.client.util.error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
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
