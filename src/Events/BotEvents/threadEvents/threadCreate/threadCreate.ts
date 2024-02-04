import type * as Discord from 'discord.js';

export default async (thread: Discord.AnyThreadChannel) => {
 thread.client.util.importCache.Events.BotEvents.channelEvents.channelCreate.log.file.default(
  thread,
 );
};
