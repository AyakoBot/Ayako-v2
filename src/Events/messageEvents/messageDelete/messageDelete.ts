import type * as Discord from 'discord.js';
import log from './log.js';
import cache from './cache.js';

export default async (msg: Discord.Message) => {
 if (!msg.inCachedGuild()) return;

 log(msg);
 cache(msg);
};
