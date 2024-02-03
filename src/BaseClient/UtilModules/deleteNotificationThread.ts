import * as Discord from 'discord.js';
import cache from './cache.js';

export default async (guild: Discord.Guild, threadId: string) => {
 cache.deleteThreads.delete(guild.id, threadId);

 if (!guild.rulesChannelId) return;
 const rawThread = await guild.client.util.getChannel.threadChannel(threadId);
 if (!rawThread) return;
 if ('message' in rawThread) return;

 guild.client.util.request.channels.delete(rawThread);
};
