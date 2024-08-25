import * as Discord from 'discord.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from './addReaction.js';

/**
 * Deletes multiple messages in a guild text-based channel.
 * @param channel - The guild text-based channel where the messages are located.
 * @param msgs - An array of message IDs to delete.
 * @returns A promise that resolves with the deleted messages or rejects with a DiscordAPIError.
 */
export default async (channel: Discord.GuildTextBasedChannel, msgs: string[]) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canBulkDelete(channel.id, await getBotMemberFromGuild(channel.guild), msgs.length)) {
  const e = requestHandlerError(`Cannot bulk-delete messages in ${channel.name} / ${channel.id}`, [
   Discord.PermissionFlagsBits.ManageMessages,
  ]);

  error(channel.guild, e);
  return e;
 }

 return (await getAPI(channel.guild)).channels.bulkDeleteMessages(channel.id, msgs).catch((e) => {
  error(channel.guild, e);
  return e as Discord.DiscordAPIError;
 });
};

/**
 * Checks if a bulk-delete can be executed by a given user in a given channel.
 * @param channelId - The ID of the guild text-based channel to check.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user has the necessary permissions.
 */
export const canBulkDelete = (channelId: string, me: Discord.GuildMember, amount: number) =>
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageMessages) &&
 amount > 1 &&
 amount < 101;
