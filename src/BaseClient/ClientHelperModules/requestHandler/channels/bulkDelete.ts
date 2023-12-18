import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Deletes multiple messages in a guild text-based channel.
 * @param channel - The guild text-based channel where the messages are located.
 * @param messages - An array of message IDs to delete.
 * @returns A promise that resolves with the deleted messages or rejects with a DiscordAPIError.
 */
export default async (channel: Discord.GuildTextBasedChannel, messages: string[]) => {
 if (!canBulkDelete(channel, await getBotMemberFromGuild(channel.guild))) {
  const e = requestHandlerError(`Cannot bulk-delete messages in ${channel.name} / ${channel.id}`, [
   Discord.PermissionFlagsBits.ManageMessages,
  ]);

  error(channel.guild, e);
  return e;
 }

 return (cache.apis.get(channel.guild.id) ?? API).channels
  .bulkDeleteMessages(channel.id, messages)
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if a bulk-delete can be executed by a given user in a given channel.
 * @param channel - The guild text-based channel to check.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user has the necessary permissions.
 */
export const canBulkDelete = (channel: Discord.GuildTextBasedChannel, me: Discord.GuildMember) =>
 me.permissionsIn(channel).has(Discord.PermissionFlagsBits.ManageMessages);
