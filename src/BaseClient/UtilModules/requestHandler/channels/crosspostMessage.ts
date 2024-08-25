import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from './addReaction.js';

/**
 * Crossposts a message to all following channels.
 * @param msg - The message to crosspost.
 * @returns A promise that resolves with the new message object if successful,
 * or rejects with an error.
 */
export default async (msg: Discord.Message<true>) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 const me = await getBotMemberFromGuild(msg.guild);

 if (!canCrosspostMessages(msg, me)) {
  const e = requestHandlerError(`Cannot crosspost message in ${msg.guild.name} / ${msg.guild.id}`, [
   Discord.PermissionFlagsBits.SendMessages,
   ...(msg.author.id === me.id ? [Discord.PermissionFlagsBits.ManageMessages] : []),
  ]);

  error(msg.guild, e);
  return e;
 }

 return (await getAPI(msg.guild)).channels
  .crosspostMessage(msg.channelId, msg.id)
  .then((m) => new Classes.Message(msg.client, m))
  .catch((e) => {
   error(msg.guild, e);
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if a message can be crossposted.
 * @param message - The message to check.
 * @param me - The guild member representing the bot.
 * @returns A boolean indicating whether the message can be crossposted.
 */
export const canCrosspostMessages = (message: Discord.Message<true>, me: Discord.GuildMember) =>
 me.permissionsIn(message.channel).has(Discord.PermissionFlagsBits.SendMessages) &&
 (message.author.id === me.id
  ? true
  : me.permissionsIn(message.channel).has(Discord.PermissionFlagsBits.ManageMessages));
