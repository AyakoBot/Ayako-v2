import * as Discord from 'discord.js';
import getBotMemberFromGuild from './getBotMemberFromGuild.js';
import error from './error.js';

/**
 * Checks if a message can be deleted by the bot.
 * @param msg - The message to check.
 * @returns Whether the message can be deleted by the bot or not.
 */
export default async (msg: Discord.Message<true>) => {
 const executor = await getBotMemberFromGuild(msg.guild);
 if (!executor) {
  error(msg.guild, new Error("I can't find myself in this guild!"));
  return false;
 }

 if (msg.author.id === executor.id) return true;
 if (executor.id === msg.guild.ownerId) return true;
 if (executor.permissions.has(Discord.PermissionFlagsBits.Administrator)) return true;
 if (executor.permissionsIn(msg.channel).has(Discord.PermissionFlagsBits.ManageMessages)) {
  return true;
 }

 return false;
};
