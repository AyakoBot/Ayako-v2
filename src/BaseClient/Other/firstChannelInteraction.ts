import * as Discord from 'discord.js';

import cache from '../UtilModules/cache.js';

export default async (channel: Discord.GuildChannel | null) => {
 if (!channel) return;
 if (!(channel instanceof Discord.GuildChannel)) return;
 if (channel.type === Discord.ChannelType.GuildCategory) return;

 if (cache.interactedChannels.has(channel.id)) return;
 cache.interactedChannels.add(channel.id);

 Object.values(tasks).forEach((t) => t(channel));
};

const tasks = {
 getPins: async (channel: Discord.GuildChannel) => {
  cache.pins.get('', channel as Parameters<typeof cache.pins.get>[1]);
 },
};
