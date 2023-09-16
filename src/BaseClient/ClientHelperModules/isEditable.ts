import * as Discord from 'discord.js';
import getBotMemberFromGuild from './getBotMemberFromGuild.js';

export default async (msg: Discord.Message<true>) => {
 const executor = await getBotMemberFromGuild(msg.guild);

 if (!executor) {
  if (msg.author.id === msg.client.user.id) return true;
  return false;
 }
 if (executor.id === msg.author.id) return true;
 return false;
};
