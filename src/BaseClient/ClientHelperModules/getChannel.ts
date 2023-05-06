import * as Discord from 'discord.js';

const getChannel = async (channelId: string) => {
 const client = (await import('../Client.js')).default;
 return client.channels.fetch(channelId, { allowUnknownGuild: true }).catch(() => undefined);
};

export const guildTextChannel = async (channelId: string) => {
 const channel = await getChannel(channelId);
 if (!channel) return undefined;
 if (!channel.isTextBased()) return undefined;
 if (channel.isDMBased()) return undefined;
 return channel;
};

export const guildVoiceChannel = async (channelId: string) => {
 const channel = await getChannel(channelId);
 if (!channel) return undefined;
 if (!channel.isVoiceBased()) return undefined;
 if (channel.isDMBased()) return undefined;
 return channel;
};

export const categoryChannel = async (channelId: string) => {
 const channel = await getChannel(channelId);
 if (!channel) return undefined;
 if (channel.type !== Discord.ChannelType.GuildCategory) return undefined;
 return channel;
};

export const parentChannel = async (channelId: string) => {
 const channel = await getChannel(channelId);
 if (!channel) return undefined;
 if (
  ![
   Discord.ChannelType.GuildCategory,
   Discord.ChannelType.GuildText,
   Discord.ChannelType.GuildForum,
  ].includes(channel.type)
 ) {
  return undefined;
 }
 return channel;
};
