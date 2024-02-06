import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

interface StartForumThreadOptions extends Discord.RESTPostAPIGuildForumThreadsJSONBody {
 message: Discord.RESTPostAPIGuildForumThreadsJSONBody['message'] & {
  files?: Discord.RawFile[];
 };
}

/**
 * Creates a new forum thread in the specified channel.
 * @param channel - The forum channel where the thread will be created.
 * @param body - The options for the new forum thread.
 * @returns A promise that resolves with the newly created forum thread channel.
 */
export default async (
 channel: Discord.ForumChannel | Discord.MediaChannel,
 body: StartForumThreadOptions,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (
  !canCreateForumThread(channel.id, await channel.client.util.getBotMemberFromGuild(channel.guild))
 ) {
  const e = channel.client.util.requestHandlerError(
   `Cannot create forum post in ${channel.name} / ${channel.id}`,
   [Discord.PermissionFlagsBits.SendMessages],
  );

  channel.client.util.error(channel.guild, e);
  return e;
 }

 return (
  channel.client.util.cache.apis.get(channel.guild.id) ?? new DiscordCore.API(channel.client.rest)
 ).channels
  .createForumThread(channel.id, body)
  .then((t) => Classes.Channel(channel.client, t, channel.guild))
  .catch((e) => {
   channel.client.util.error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the specified user has permission to create a forum thread in the given channel.
 * @param channelId - The ID of the channel in which the forum thread is to be created.
 * @param me - The guild member representing the user.
 * @returns True if the user has permission to create a forum thread, false otherwise.
 */
export const canCreateForumThread = (channelId: string, me: Discord.GuildMember) =>
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.SendMessages);
