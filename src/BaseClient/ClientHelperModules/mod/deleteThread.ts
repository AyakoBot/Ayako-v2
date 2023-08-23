import * as Discord from 'discord.js';

import { request } from '../requestHandler.js';
import cache from '../cache.js';
import DataBase from '../../DataBase.js';

export default async (guild: Discord.Guild, threadId: string) => {
 cache.deleteThreads.delete(guild.id, threadId);
 DataBase.deletethreads
  .delete({
   where: {
    guildid: guild.id,
    channelid: threadId,
   },
  })
  .then();

 if (!guild.rulesChannel) return;
 const rawThread = await request.channels.get(guild, threadId);
 if ('message' in rawThread) return;
 request.channels.delete(guild, rawThread.id);
};
