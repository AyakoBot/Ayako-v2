import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction) => {
 const channel = cmd.channel;
 if (!channel) return;

 if (
  ![Discord.ChannelType.PublicThread, Discord.ChannelType.PrivateThread].includes(channel.type)
 ) {
  return;
 }

 await channel.delete().catch(() => undefined);
};
