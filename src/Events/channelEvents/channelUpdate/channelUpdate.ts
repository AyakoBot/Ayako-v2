import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import cache from './cache.js';
import log from './log.js';
import stickyPerms from './stickyPerms.js';

export default async (oldChannel: Discord.Channel | undefined, channel: Discord.Channel) => {
 if (!('guild' in channel)) return;
 if (oldChannel && !('guild' in oldChannel)) return;

 log(oldChannel, channel);
 cache(oldChannel, channel);

 if (
  channel.type === Discord.ChannelType.PublicThread ||
  channel.type === Discord.ChannelType.PrivateThread ||
  channel.type === Discord.ChannelType.AnnouncementThread
 ) {
  return;
 }

 Jobs.scheduleJob(new Date(Date.now() + 10000), () => {
  stickyPerms(oldChannel as Discord.GuildChannel, channel as Discord.GuildChannel);
 });
};
