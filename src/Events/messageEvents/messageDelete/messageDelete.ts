import type * as Discord from 'discord.js';
import log from './log.js';
import cache from './cache.js';
import sticky from './sticky.js';

export default async (msg: Discord.Message) => {
 if (!msg.inGuild()) return;

 sticky(msg);
 log(msg);
 cache(msg);
};
