import * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (channel: Discord.Channel) => {
  if (channel.type === Discord.ChannelType.DM) return;
  if (channel.type === Discord.ChannelType.GroupDM) return;

  const files: {
    default: (
      t:
        | Discord.CategoryChannel
        | Discord.NewsChannel
        | Discord.StageChannel
        | Discord.TextChannel
        | Discord.PrivateThreadChannel
        | Discord.PublicThreadChannel
        | Discord.VoiceChannel
        | Discord.ForumChannel,
    ) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  const channelBans = client.ch.cache.channelBans.cache.get(channel.guild.id)?.get(channel.id);
  if (channelBans) {
    const array = Array.from(channelBans, ([, g]) => g);
    array.forEach((a) => a.reschedule(Date.now() + 10000));
  }

  files.forEach((f) => f.default(channel));
};
