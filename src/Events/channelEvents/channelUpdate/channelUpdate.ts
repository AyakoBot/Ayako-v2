import * as Discord from 'discord.js';

export default async (oldChannel: Discord.Channel | undefined, channel: Discord.Channel) => {
  if (channel.type === Discord.ChannelType.DM) return;
  if (oldChannel?.type === Discord.ChannelType.DM) return;
  if (channel.type === Discord.ChannelType.GroupDM) return;
  if (oldChannel?.type === Discord.ChannelType.GroupDM) return;

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
        | Discord.ForumChannel
        | undefined,
      o:
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

  files.forEach((f) => f.default(oldChannel, channel));
};
