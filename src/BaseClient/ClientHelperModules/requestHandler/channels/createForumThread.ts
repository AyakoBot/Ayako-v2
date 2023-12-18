import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

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
 if (!canCreateForumThread(channel, await getBotMemberFromGuild(channel.guild))) {
  const e = requestHandlerError(`Cannot create forum post in ${channel.name} / ${channel.id}`, [
   Discord.PermissionFlagsBits.SendMessages,
  ]);

  error(channel.guild, e);
  return e;
 }

 return (cache.apis.get(channel.guild.id) ?? API).channels
  .createForumThread(channel.id, body)
  .then((t) => Classes.Channel(channel.client, t, channel.guild))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the specified user has permission to create a forum thread in the given channel.
 * @param channel - The channel in which the forum thread is to be created.
 * @param me - The guild member representing the user.
 * @returns True if the user has permission to create a forum thread, false otherwise.
 */
export const canCreateForumThread = (
 channel: Discord.ForumChannel | Discord.MediaChannel,
 me: Discord.GuildMember,
) => me.permissionsIn(channel).has(Discord.PermissionFlagsBits.SendMessages);
