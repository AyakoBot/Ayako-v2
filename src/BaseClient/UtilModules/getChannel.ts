import * as Discord from 'discord.js';

/**
 * Fetches a channel by its ID.
 * @param channelId The ID of the channel to fetch.
 * @returns A Promise that resolves with the fetched channel,
 * or undefined if the channel was not found.
 */
const getChannel = async (channelId: string) => {
 const client = (await import('../Bot/Client.js')).default;
 return client.channels.fetch(channelId, { allowUnknownGuild: true }).catch(() => undefined);
};

/**
 * Retrieves a thread channel by its ID.
 * @param channelId The ID of the channel to retrieve.
 * @returns The thread channel if found, otherwise undefined.
 */
export const threadChannel = async (channelId: string) => {
 const channel = await getChannel(channelId);
 if (!channel) return undefined;
 if (!channel.isThread()) return undefined;
 return channel;
};

/**
 * Returns a guild text channel with the given ID.
 * @param channelId - The ID of the channel to retrieve.
 * @returns The guild text channel with the given ID,
 * or undefined if it does not exist or is not a guild text channel.
 */
export const guildTextChannel = async (channelId: string) => {
 const channel = await getChannel(channelId);
 if (!channel) return undefined;
 if (!channel.isTextBased()) return undefined;
 if (channel.isDMBased()) return undefined;
 return channel;
};

/**
 * Retrieves a guild voice channel by its ID.
 * @param channelId - The ID of the channel to retrieve.
 * @returns The voice channel if found, otherwise undefined.
 */
export const guildVoiceChannel = async (channelId: string) => {
 const channel = await getChannel(channelId);
 if (!channel) return undefined;
 if (!channel.isVoiceBased()) return undefined;
 if (channel.isDMBased()) return undefined;
 return channel;
};

/**
 * Retrieves a category channel by its ID.
 * @param channelId The ID of the category channel to retrieve.
 * @returns The category channel with the specified ID,
 * or undefined if not found or not a category channel.
 */
export const categoryChannel = async (channelId: string) => {
 const channel = await getChannel(channelId);
 if (!channel) return undefined;
 if (channel.type !== Discord.ChannelType.GuildCategory) return undefined;
 return channel;
};

/**
 * Retrieves the channel as a parent channel of a given channel ID.
 * @param channelId The ID of the channel to retrieve as parent channel.
 * @returns The channel of the given channel ID,
 * or undefined if it does not exist or is not a valid parent channel type.
 */
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
