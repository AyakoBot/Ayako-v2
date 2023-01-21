import type * as Discord from 'discord.js';

export default async (oldThread: Discord.AnyThreadChannel, thread: Discord.AnyThreadChannel) => {
  (await import('../../channelEvents/channelUpdate/log.js')).default(oldThread, thread);
};
