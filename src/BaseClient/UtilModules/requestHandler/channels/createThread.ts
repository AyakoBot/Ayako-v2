import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import getActiveThreads from '../guilds/getActiveThreads.js';
import { getAPI } from './addReaction.js';

/**
 * Creates a thread in a guild text-based channel.
 * @param channel - The guild text-based channel where the thread will be created.
 * @param body - The REST API JSON body for creating the thread.
 * @param msgId - The ID of the message to create the thread from.
 * @returns A promise that resolves with the created thread or rejects with a DiscordAPIError.
 */
export default async (
 channel: Discord.GuildTextBasedChannel,
 body: Discord.RESTPostAPIChannelThreadsJSONBody,
 msgId?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!(await canCreateThread(channel, body, await getBotMemberFromGuild(channel.guild)))) {
  const e = requestHandlerError(
   `Cannot create ${
    body.type === Discord.ChannelType.PrivateThread ? 'private' : 'public / announcement'
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

 return (await getAPI(channel.guild)).channels
  .createThread(channel.id, body, msgId)
  .then((t) => Classes.Channel<10>(channel.client, t, channel.guild))
  .catch((e) => {
   error(channel.guild, e);
   e.message += ` in ${channel.id} - Reported ${
    channel.guild.channels.cache.filter(
     (c) =>
      (c.type === Discord.ChannelType.PrivateThread ||
       c.type === Discord.ChannelType.PublicThread) &&
      c.parentId === channel.id,
    ).size
   } threads`;

   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the bot can create a thread in the specified channel.
 * @param channel - The guild text-based channel.
 * @param body - The REST API channel threads JSON body.
 * @param me - The guild member representing the bot.
 * @returns A boolean indicating whether the bot can create a thread in the channel.
 */
export const canCreateThread = async (
 channel: Discord.GuildTextBasedChannel,
 body: Discord.RESTPostAPIChannelThreadsJSONBody,
 me: Discord.GuildMember,
) =>
 [
  Discord.ChannelType.GuildAnnouncement,
  Discord.ChannelType.GuildStageVoice,
  Discord.ChannelType.GuildText,
  Discord.ChannelType.GuildVoice,
 ].includes(channel.type) &&
 me.permissionsIn(channel.id).has(Discord.PermissionFlagsBits.ViewChannel) &&
 (body.type === Discord.ChannelType.PublicThread
  ? me.permissionsIn(channel.id).has(Discord.PermissionFlagsBits.CreatePublicThreads)
  : me.permissionsIn(channel.id).has(Discord.PermissionFlagsBits.CreatePrivateThreads) &&
    channel.type !== Discord.ChannelType.GuildAnnouncement) &&
 Number(
  (await getActiveThreads(channel.guild).then((m) => ('message' in m ? undefined : m)))?.filter(
   (t) => t.parentId === channel.id,
  ).length,
 ) < 800; // should be 1000, but we should be safe
