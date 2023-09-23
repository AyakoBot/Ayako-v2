import * as Discord from 'discord.js';
import getBotMemberFromGuild from './getBotMemberFromGuild.js';

/**
 * Checks if a message is editable by the bot.
 * @param msg The message to check.
 * @returns A boolean indicating whether the message is editable by the bot.
 */
export default async (msg: Discord.Message<true>) => {
 const executor = await getBotMemberFromGuild(msg.guild);

 if (!executor) {
  if (msg.author.id === msg.client.user.id) return true;
  return false;
 }
 if (executor.id === msg.author.id) return true;
 return false;
};
