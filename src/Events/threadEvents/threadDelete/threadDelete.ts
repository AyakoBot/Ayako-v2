import type * as Discord from 'discord.js';
import log from '../../channelEvents/channelDelete/log.js';

export default async (thread: Discord.AnyThreadChannel) => {
 log(thread);
};
