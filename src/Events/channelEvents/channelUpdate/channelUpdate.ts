import * as Discord from 'discord.js';
import log from './log.js';

export default async (oldChannel: Discord.Channel | undefined, channel: Discord.Channel) => {
  if (channel.type === Discord.ChannelType.DM) return;
  if (oldChannel?.type === Discord.ChannelType.DM) return;
  if (channel.type === Discord.ChannelType.GroupDM) return;
  if (oldChannel?.type === Discord.ChannelType.GroupDM) return;

  log(oldChannel, channel);
};
