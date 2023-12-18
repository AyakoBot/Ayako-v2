import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Sends a message to a Discord channel.
 * @param guild The guild where the channel is located.
 * @param channelId The ID of the channel where the message will be sent.
 * @param payload The message content and options.
 * @param client The Discord client instance.
 * @returns A Promise that resolves to a new Message object if the message was sent successfully,
 * or rejects with a DiscordAPIError if an error occurred.
 */
export default async (
 guild: Discord.Guild | undefined | null,
 channelId: string,
 payload: Discord.RESTPostAPIChannelMessageJSONBody & {
  files?: Discord.RawFile[];
 },
 client: Discord.Client<true>,
) => {
 if (
  guild &&
  !canSendMessage(
   guild.channels.cache.get(channelId) as Discord.GuildBasedChannel,
   payload,
   await getBotMemberFromGuild(guild),
  )
 ) {
  const e = requestHandlerError(`Cannot send message in ${guild.name} / ${guild.id}`, [
   Discord.PermissionFlagsBits.SendMessages,
   Discord.PermissionFlagsBits.SendMessagesInThreads,
   Discord.PermissionFlagsBits.ReadMessageHistory,
   Discord.PermissionFlagsBits.AttachFiles,
  ]);

  error(guild, e);
  return e;
 }

 return (guild ? cache.apis.get(guild.id) ?? API : API).channels
  .createMessage(channelId, {
   ...payload,
   message_reference: payload.message_reference
    ? { ...payload.message_reference, fail_if_not_exists: false }
    : undefined,
  })
  .then((m) => new Classes.Message(client, m))
  .catch((e: Discord.DiscordAPIError) => {
   if (guild) error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Determines whether the user can send a message in a channel.
 * @param channel - The channel in which the message will be sent.
 * @param payload - The message payload, including optional files.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user can send the message.
 */
export const canSendMessage = (
 channel: Discord.GuildBasedChannel,
 payload: Discord.RESTPostAPIChannelMessageJSONBody & {
  files?: Discord.RawFile[];
 },
 me: Discord.GuildMember,
) => {
 switch (true) {
  case Number(me.communicationDisabledUntilTimestamp) > Date.now():
   return false;
  case !channel.isThread() &&
   !me.permissionsIn(channel).has(Discord.PermissionFlagsBits.SendMessages):
  case channel.isThread() &&
   !me.permissionsIn(channel).has(Discord.PermissionFlagsBits.SendMessagesInThreads):
   return false;
  case payload.tts && !me.permissionsIn(channel).has(Discord.PermissionFlagsBits.SendTTSMessages): {
   payload.tts = false;
   return true;
  }
  case payload.message_reference &&
   !me.permissionsIn(channel).has(Discord.PermissionFlagsBits.ReadMessageHistory): {
   payload.message_reference = undefined;
   return true;
  }
  case payload.files?.length &&
   !me.permissionsIn(channel).has(Discord.PermissionFlagsBits.AttachFiles):
   return false;

  default:
   return true;
 }
};
