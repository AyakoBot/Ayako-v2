import * as DiscordCore from '@discordjs/core';
import * as Discord from 'discord.js';

import sendMessage from './sendMessage.js';

/**
 * Sends a reply message to a Discord channel.
 * @param msg The original message to reply to.
 * @param payload The message payload to send.
 * @returns A Promise that resolves with the sent message, or rejects with a DiscordAPIError.
 */
export default async (
 msg: Discord.Message<true>,
 payload: Parameters<DiscordCore.ChannelsAPI['createMessage']>[1],
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return sendMessage(
  msg.guild,
  msg.channelId,
  {
   ...payload,
   message_reference: {
    message_id: msg.id,
    channel_id: msg.channelId,
    guild_id: msg.guildId,
    fail_if_not_exists: false,
   },
  },
  msg.client,
 );
};
