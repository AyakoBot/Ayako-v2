import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Crossposts a message to all following channels.
 * @param message - The message to crosspost.
 * @returns A promise that resolves with the new message object if successful,
 * or rejects with an error.
 */
export default async (message: Discord.Message<true>) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 const me = await getBotMemberFromGuild(message.guild);

 if (!canCrosspostMessages(message, me)) {
  const e = requestHandlerError(
   `Cannot crosspost message in ${message.guild.name} / ${message.guild.id}`,
   [
    Discord.PermissionFlagsBits.SendMessages,
    ...(message.author.id === me.id ? [Discord.PermissionFlagsBits.ManageMessages] : []),
   ],
  );

  error(message.guild, e);
  return e;
 }

 return (cache.apis.get(message.guild.id) ?? API).channels
  .crosspostMessage(message.channelId, message.id)
  .then((m) => new Classes.Message(message.client, m))
  .catch((e) => {
   error(message.guild, e);
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
