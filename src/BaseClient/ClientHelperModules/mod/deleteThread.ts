import * as Discord from 'discord.js';

import { request } from '../requestHandler.js';
import cache from '../cache.js';

export default async (guild: Discord.Guild, threadId: string) => {
 cache.deleteThreads.delete(guild.id, threadId);

 if (!guild.rulesChannelId) return;
 const rawThread = await request.channels.get(guild, threadId);
 if ('message' in rawThread) return;
 request.channels.delete(guild, rawThread.id);
};
