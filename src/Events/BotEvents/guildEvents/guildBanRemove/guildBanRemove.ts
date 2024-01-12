import type * as Discord from 'discord.js';
import cache from './cache.js';
import log from './log.js';

export default async (ban: Discord.GuildBan) => {
 log(ban);
 cache(ban);
};
