import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from './addReaction.js';

/**
 * Creates an invite for a guild-based channel.
 * @param channel - The guild-based channel to create the invite for.
 * @param body - The invite data to send.
 * @param reason - The reason for creating the invite.
 * @returns A promise that resolves with the created invite or rejects with a DiscordAPIError.
 */
export default async (
 channel: Discord.GuildBasedChannel,
 body: Discord.RESTPostAPIChannelInviteJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canCreateInvite(channel.id, await getBotMemberFromGuild(channel.guild))) {
  const e = requestHandlerError(`Cannot create invite in ${channel.name} / ${channel.id}`, [
   Discord.PermissionFlagsBits.CreateInstantInvite,
  ]);

  error(channel.guild, e);
  return e;
 }

 return (await getAPI(channel.guild)).channels
  .createInvite(channel.id, body, { reason })
  .then((i) => new Classes.Invite(channel.client, i))
  .catch((e: Discord.DiscordAPIError) => {
   error(channel.guild, e);
   return e;
  });
};

/**
 * Checks if the given user has permission to create an invite in the specified channel.
 * @param channelId - The ID of the guild-based channel to check.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user can create an invite in the channel.
 */
export const canCreateInvite = (channelId: string, me: Discord.GuildMember) =>
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.CreateInstantInvite);
