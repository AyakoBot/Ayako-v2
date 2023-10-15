import * as Discord from 'discord.js';
import log from './log.js';
import cache from './cache.js';
import stickyPerms from './stickyPerms.js';

export default async (oldChannel: Discord.Channel | undefined, channel: Discord.Channel) => {
 if (channel.type === Discord.ChannelType.DM) return;
 if (oldChannel?.type === Discord.ChannelType.DM) return;
 if (channel.type === Discord.ChannelType.GroupDM) return;
 if (oldChannel?.type === Discord.ChannelType.GroupDM) return;

 log(oldChannel, channel);
 cache(oldChannel, channel);

 if (
  channel.type === Discord.ChannelType.PublicThread ||
  channel.type === Discord.ChannelType.PrivateThread ||
  channel.type === Discord.ChannelType.AnnouncementThread
 ) {
  return;
 }

 stickyPerms(oldChannel as Discord.GuildChannel, channel as Discord.GuildChannel);
};
