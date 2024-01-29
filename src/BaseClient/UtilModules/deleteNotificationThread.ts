import * as Discord from 'discord.js';

import cache from './cache.js';
import * as getChannel from './getChannel.js';
import { request } from './requestHandler.js';

export default async (guild: Discord.Guild, threadId: string) => {
 cache.deleteThreads.delete(guild.id, threadId);

 if (!guild.rulesChannelId) return;
 const rawThread = await getChannel.threadChannel(threadId);
 if (!rawThread) return;
 if ('message' in rawThread) return;

 request.channels.delete(rawThread);
};
