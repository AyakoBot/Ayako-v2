import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import getPathFromError from '../../../../BaseClient/UtilModules/getPathFromError.js';
import cache from './cache.js';
import log from './log.js';
import stickyPerms from './stickyPerms.js';
import voiceHub from './voiceHub.js';

export default async (oldChannel: Discord.Channel | undefined, channel: Discord.Channel) => {
 if (!('guild' in channel)) return;
 if (oldChannel && !('guild' in oldChannel)) return;

 log(oldChannel, channel);
 cache(oldChannel, channel);

 if (channel.isThread()) return;

 voiceHub(channel);

 Jobs.scheduleJob(getPathFromError(new Error(channel.id)), new Date(Date.now() + 10000), () => {
  stickyPerms(oldChannel as Discord.GuildChannel, channel as Discord.GuildChannel);
 });
};
