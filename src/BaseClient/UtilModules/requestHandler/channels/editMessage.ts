import * as DiscordCore from '@discordjs/core';
import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Edits a message in a channel.
 * @param guild The guild where the channel belongs.
 * @param channelId The ID of the channel where the message is located.
 * @param messageId The ID of the message to edit.
 * @param payload The new message content.
 * @returns A Promise that resolves with the edited message or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 channelId: string,
 messageId: string,
 payload: Parameters<DiscordCore.ChannelsAPI['editMessage']>[2],
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return (cache.apis.get(guild.id) ?? API).channels
  .editMessage(channelId, messageId, payload)
  .then((m) => new Classes.Message(guild.client, m))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
