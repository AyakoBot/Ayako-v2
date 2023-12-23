import type * as Discord from 'discord.js';
import cache from './cache.js';
import log from './log.js';

export default async (msg: Discord.Message) => {
 if (!msg.inGuild()) return;

 log(msg);
 cache(msg);
};
