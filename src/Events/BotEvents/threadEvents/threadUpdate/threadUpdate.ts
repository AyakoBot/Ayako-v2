import type * as Discord from 'discord.js';
import log from '../../channelEvents/channelUpdate/log.js';
import ticketing from './ticketing.js';

export default async (oldThread: Discord.AnyThreadChannel, thread: Discord.AnyThreadChannel) => {
 ticketing(thread);
 log(oldThread, thread);
};
