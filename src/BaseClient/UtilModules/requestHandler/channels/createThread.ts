import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

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
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (
  !canCreateThread(channel.id, body, await channel.client.util.getBotMemberFromGuild(channel.guild))
 ) {
  const e = channel.client.util.requestHandlerError(
   `Cannot create ${
    body.type === Discord.ChannelType.PrivateThread ? 'private' : 'public / announcement'
   } threads in ${channel.name} / ${channel.id}`,
   [
    body.type === Discord.ChannelType.PublicThread
     ? Discord.PermissionFlagsBits.CreatePublicThreads
     : Discord.PermissionFlagsBits.CreatePrivateThreads,
   ],
  );

  channel.client.util.error(channel.guild, e);
  return e;
 }

 return (
  channel.client.util.cache.apis.get(channel.guild.id) ?? new DiscordCore.API(channel.client.rest)
 ).channels
  .createThread(channel.id, body, messageId)
  .then((t) => Classes.Channel<10>(channel.client, t, channel.guild))
  .catch((e) => {
   channel.client.util.error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given user has permission to create a thread in the specified channel.
 * @param channelId - The ID of the guild text-based channel to check.
 * @param me - The guild member representing the user.
 * @returns True if the user has permission to create a thread, false otherwise.
 */
export const canCreateThread = (
 channelId: string,
 body: Discord.RESTPostAPIChannelThreadsJSONBody,
 me: Discord.GuildMember,
) =>
 body.type === Discord.ChannelType.PublicThread
  ? me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.CreatePublicThreads)
  : me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.CreatePrivateThreads);
