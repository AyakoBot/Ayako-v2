import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

import { canGetMessage } from './getMessage.js';
import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Shows typing indicator in the given guild text-based channel.
 * @param channel - The guild text-based channel to show typing indicator in.
 * @returns A promise that resolves when the typing indicator is successfully shown,
 * or rejects with an error.
 */
export default async (channel: Discord.GuildTextBasedChannel) => {
 if (!canGetMessage(channel, await getBotMemberFromGuild(channel.guild))) {
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

 return (cache.apis.get(channel.guild.id) ?? API).channels.showTyping(channel.id).catch((e) => {
  error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
 });
};
