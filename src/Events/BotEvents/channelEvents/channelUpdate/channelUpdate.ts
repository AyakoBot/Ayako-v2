import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';

export default async (oldChannel: Discord.Channel | undefined, channel: Discord.Channel) => {
 if (!('guild' in channel)) return;
 if (oldChannel && !('guild' in oldChannel)) return;

 channel.client.util.importCache.Events.BotEvents.channelEvents.channelUpdate.log.file.default(
  oldChannel,
  channel,
 );
 channel.client.util.importCache.Events.BotEvents.channelEvents.channelUpdate.cache.file.default(
  oldChannel,
  channel,
 );

 if (
  channel.type === Discord.ChannelType.PublicThread ||
  channel.type === Discord.ChannelType.PrivateThread ||
  channel.type === Discord.ChannelType.AnnouncementThread
 ) {
  return;
 }

 Jobs.scheduleJob(new Date(Date.now() + 10000), () => {
  channel.client.util.importCache.Events.BotEvents.channelEvents.channelUpdate.stickyPerms.file.default(
   oldChannel as Discord.GuildChannel,
   channel as Discord.GuildChannel,
  );
 });
};
