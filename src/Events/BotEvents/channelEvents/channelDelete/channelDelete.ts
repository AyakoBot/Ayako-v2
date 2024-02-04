import * as Discord from 'discord.js';

export default async (channel: Discord.Channel) => {
 if (!('guild' in channel)) return;

 const channelBans = channel.client.util.cache.channelBans.cache
  .get(channel.guild.id)
  ?.get(channel.id);
 if (channelBans) {
  const array = Array.from(channelBans, ([, g]) => g);
  array.forEach((a) => a.reschedule(Date.now() + 10000));
 }

 channel.client.util.importCache.Events.BotEvents.channelEvents.channelDelete.log.file.default(
  channel,
 );
 channel.client.util.importCache.Events.BotEvents.channelEvents.channelDelete.cache.file.default(
  channel,
 );
};
