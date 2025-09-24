import * as DiscordCore from '@discordjs/core';
import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from './addReaction.js';

/**
 * Edits a message in a channel.
 * @param msg - The message to edit.
 * @param payload - The new message content and options.
 * @returns A promise that resolves with the edited message, or rejects with a DiscordAPIError.
 */
export default async (
 msg: Discord.Message<true>,
 payload: Parameters<DiscordCore.ChannelsAPI['editMessage']>[2],
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEditMessage(msg, payload, await getBotMemberFromGuild(msg.guild))) {
  const e = requestHandlerError(`Cannot edit message in ${msg.guild.name} / ${msg.guild.id}`, [
   Discord.PermissionFlagsBits.ManageMessages,
  ]);

  error(msg.guild, e);
  return e;
 }

 return (await getAPI(msg.guild)).channels
  .editMessage(msg.channel.id, msg.id, payload)
  .then((m) => new Classes.Message(msg.client, m))
  .catch((e: Discord.DiscordAPIError) => {
   e.cause = payload;
   error(msg.guild, e, true);
   return e;
  });
};

/**
 * Checks if the message can be edited.
 * @param msg - The message to be edited.
 * @param payload - The payload containing the message edit data.
 * @param me - The guild member representing the user.
 * @returns Returns true if the message can be edited, otherwise false.
 */
export const canEditMessage = (
 msg: Discord.Message<true>,
 payload: Parameters<DiscordCore.ChannelsAPI['editMessage']>[2],
 me: Discord.GuildMember,
) =>
 msg.author.id === me.id
  ? true
  : me.permissionsIn(msg.channelId).has(Discord.PermissionFlagsBits.ManageMessages) &&
    !!payload.flags;
