import * as Discord from 'discord.js';

export default async (msg: Discord.Message<true>) => {
 if (!msg.guild) return;
 if (msg.channel.type !== Discord.ChannelType.PrivateThread) return;
 if (
  msg.channel.ownerId !== msg.client.user.id &&
  msg.channel.ownerId === (await msg.client.util.getBotIdFromGuild(msg.guild))
 ) {
  return;
 }
 if (msg.channel.name !== '⚠️') return;

 msg.client.util.request.channels.deleteMessage(msg);
};
