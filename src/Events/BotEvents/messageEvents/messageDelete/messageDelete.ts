import type * as Discord from 'discord.js';
import cache from './cache.js';
import log from './log.js';
import welcomeGifChannel from './welcomeGifChannel.js';

export default async (msg: Discord.Message, isBulk: Discord.Message<true>[] | boolean = false) => {
 if (!msg.inGuild()) return;

 if (!isBulk) welcomeGifChannel(msg);
 log(msg, isBulk);
 cache(msg);
};
