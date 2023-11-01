import * as DiscordCore from '@discordjs/core';
import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import * as CT from '../../../../Typings/CustomTypings';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Edits a message in a channel.
 * @param message - The message to edit.
 * @param payload - The new message content and options.
 * @returns A promise that resolves with the edited message, or rejects with a DiscordAPIError.
 */
export default async (
 message: Discord.Message<true>,
 payload: CT.Argument<DiscordCore.ChannelsAPI['editMessage'], 2>,
) =>
 (cache.apis.get(message.guild.id) ?? API).channels
  .editMessage(message.channel.id, message.id, payload)
  .then((m) => new Classes.Message(message.client, m))
  .catch((e) => {
   error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
