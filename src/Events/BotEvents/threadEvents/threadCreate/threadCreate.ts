import type * as Discord from 'discord.js';
import log from '../../channelEvents/channelCreate/log.js';

export default async (thread: Discord.AnyThreadChannel) => {
 log(thread);
};
