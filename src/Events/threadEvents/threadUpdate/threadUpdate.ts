import type * as Discord from 'discord.js';
import log from '../../channelEvents/channelUpdate/log.js';

export default async (oldThread: Discord.AnyThreadChannel, thread: Discord.AnyThreadChannel) => {
 log(oldThread, thread);
};
