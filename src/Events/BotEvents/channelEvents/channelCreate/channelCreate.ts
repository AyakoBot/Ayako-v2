import type * as Discord from 'discord.js';

export default async (channel: Discord.GuildChannel) => {
 channel.client.util.importCache.Events.BotEvents.channelEvents.channelCreate.log.file.default(
  channel,
 );
};
