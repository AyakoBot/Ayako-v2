import * as Discord from 'discord.js';

export default async (channel: Discord.GuildChannel | null) => {
 if (!channel) return;
 if (!(channel instanceof Discord.GuildChannel)) return;
 if (channel.type === Discord.ChannelType.GuildCategory) return;

 if (channel.client.util.cache.interactedChannels.has(channel.id)) return;
 channel.client.util.cache.interactedChannels.add(channel.id);

 Object.values(tasks).forEach((t) => t(channel));
};

const tasks = {
 getPins: async (channel: Discord.GuildChannel) => {
  channel.client.util.cache.pins.get(
   '',
   channel as Parameters<typeof channel.client.util.cache.pins.get>[1],
  );
 },
};
