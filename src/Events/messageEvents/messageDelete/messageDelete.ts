import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import cache from './cache.js';
import log from './log.js';

export default async (msg: Discord.Message) => {
 if (!msg.inGuild()) return;

 await ch.firstGuildInteraction(msg.guild);

 log(msg);
 cache(msg);
};
