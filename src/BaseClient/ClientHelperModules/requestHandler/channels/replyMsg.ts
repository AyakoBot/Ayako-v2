import * as DiscordCore from '@discordjs/core';
import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import * as CT from '../../../../Typings/CustomTypings';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Sends a reply message to a Discord channel.
 * @param message The original message to reply to.
 * @param payload The message payload to send.
 * @returns A Promise that resolves with the sent message, or rejects with a DiscordAPIError.
 */
export default (
 message: Discord.Message<true>,
 payload: CT.Argument<DiscordCore.ChannelsAPI['createMessage'], 1>,
) =>
 (cache.apis.get(message.guild.id) ?? API).channels
  .createMessage(message.channel.id, {
   ...payload,
   message_reference: {
    message_id: message.id,
    channel_id: message.channelId,
    guild_id: message.guildId,
   },
  })
  .then((m) => new Classes.Message(message.client, m))
  .catch((e) => {
   error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
