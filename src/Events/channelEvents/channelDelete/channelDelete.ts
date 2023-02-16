import * as Discord from 'discord.js';
import { ch } from '../../../BaseClient/Client.js';
import log from './log.js';

export default async (channel: Discord.Channel) => {
  if (channel.type === Discord.ChannelType.DM) return;
  if (channel.type === Discord.ChannelType.GroupDM) return;

  const channelBans = ch.cache.channelBans.cache.get(channel.guild.id)?.get(channel.id);
  if (channelBans) {
    const array = Array.from(channelBans, ([, g]) => g);
    array.forEach((a) => a.reschedule(Date.now() + 10000));
  }

  log(channel);
};
