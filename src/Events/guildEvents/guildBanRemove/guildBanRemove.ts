import type * as Discord from 'discord.js';
import log from './log.js';
import cache from './cache.js';

export default async (ban: Discord.GuildBan) => {
 log(ban);
 cache(ban);
};
