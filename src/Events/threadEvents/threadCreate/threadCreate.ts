import type * as Discord from 'discord.js';

export default async (thread: Discord.AnyThreadChannel) => {
 (await import('../../channelEvents/channelCreate/log.js')).default(thread);
};
