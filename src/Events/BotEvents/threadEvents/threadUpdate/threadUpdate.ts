import type * as Discord from 'discord.js';

export default async (oldThread: Discord.AnyThreadChannel, thread: Discord.AnyThreadChannel) => {
 thread.client.util.importCache.Events.BotEvents.channelEvents.channelUpdate.log.file.default(
  oldThread,
  thread,
 );
};
