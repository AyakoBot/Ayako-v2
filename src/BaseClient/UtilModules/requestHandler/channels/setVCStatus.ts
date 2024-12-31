import * as Discord from 'discord.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from './addReaction.js';

/**
 * Sets the channel status of a voice channel.
 * @param channel - The guild voice channel to show the status in.
 * @param status - The status to show in the voice channel.
 * @returns A promise that resolves when the status is successfully set,
 * or rejects with an error.
 */
export default async (channel: Discord.BaseGuildVoiceChannel, status: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canSetVCStatus(channel.id, await getBotMemberFromGuild(channel.guild))) {
  const e = requestHandlerError(`Cannot show typing indicator in ${channel.name} / ${channel.id}`, [
   Discord.PermissionFlagsBits.ViewChannel,
   Discord.PermissionFlagsBits.ReadMessageHistory,
   ...([Discord.ChannelType.GuildVoice, Discord.ChannelType.GuildStageVoice].includes(channel.type)
    ? [Discord.PermissionFlagsBits.Connect]
    : []),
  ]);

  error(channel.guild, e);
  return e;
 }

 return (await getAPI(channel.guild)).rest
  .put(`/channels/${channel.id}/voice-status`, { body: { status } })
  .catch((e: Discord.DiscordAPIError) => {
   error(channel.guild, e);
   return e;
  })
  .then((e) => ('message' in (e as Error) ? (e as Error) : true));
};

/**
 * Checks if the user has the permission to set the VC Status in a guild voice channel.
 * @param channelId - The ID of the guild voice channel to check.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user can set vc status in the channel.
 */
export const canSetVCStatus = (channelId: string, me: Discord.GuildMember) =>
 (me.guild.voiceStates.cache.find((c) => c.channelId === channelId && c.member?.id === me.id) &&
  me.permissionsIn(channelId).has(281474976710656n)) ||
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageChannels);
