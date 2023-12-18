import * as DiscordCore from '@discordjs/core';
import * as Discord from 'discord.js';

import sendMessage from './sendMessage.js';

/**
 * Sends a reply message to a Discord channel.
 * @param message The original message to reply to.
 * @param payload The message payload to send.
 * @returns A Promise that resolves with the sent message, or rejects with a DiscordAPIError.
 */
export default async (
 message: Discord.Message<true>,
 payload: Parameters<DiscordCore.ChannelsAPI['createMessage']>[1],
) =>
 sendMessage(
  message.guild,
  message.channelId,
  {
   ...payload,
   message_reference: {
    message_id: message.id,
    channel_id: message.channelId,
    guild_id: message.guildId,
    fail_if_not_exists: false,
   },
  },
  message.client,
 );
