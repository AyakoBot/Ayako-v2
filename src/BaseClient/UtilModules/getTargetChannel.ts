import * as Discord from 'discord.js';
import * as getChannel from './getChannel.js';

export default async (
 msg: Discord.Message<true>,
 args: string[],
): Promise<{ channel: Discord.GuildTextBasedChannel; reason: string }> => {
 let channel = msg.mentions.channels.first();

 if (!channel?.isTextBased()) channel = msg.channel;

 if (!channel) {
  if (args[1].length) {
   return { channel: msg.channel, reason: args.slice(1).join(' ') };
  }

  channel = await getChannel.guildTextChannel(args[1]);
 }

 if (!channel) {
  return { channel: msg.channel, reason: args.slice(1).join(' ') };
 }

 return { channel: channel as Discord.GuildTextBasedChannel, reason: args.slice(2).join(' ') };
};
