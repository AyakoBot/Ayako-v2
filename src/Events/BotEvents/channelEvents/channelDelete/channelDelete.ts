import * as Discord from 'discord.js';
import cache from './cache.js';
import log from './log.js';
import welcomeGifChannel from './welcomeGifChannel.js';

export default async (channel: Discord.Channel) => {
 if (!('guild' in channel)) return;

 const channelBans = channel.client.util.cache.channelBans.cache
  .get(channel.guild.id)
  ?.get(channel.id);
 if (channelBans) {
  const array = Array.from(channelBans, ([, g]) => g);
  array.forEach((a) => a.reschedule(Date.now() + 10000));
 }

 log(channel);
 cache(channel);
 welcomeGifChannel(channel);
};
