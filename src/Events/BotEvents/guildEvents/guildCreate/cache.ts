import * as Discord from 'discord.js';
import stickyPerms from '../../channelEvents/channelUpdate/stickyPerms.js';
import { tasks } from '../../readyEvents/startupTasks/cache.js';

export default (guild: Discord.Guild) => {
 Object.values(tasks).forEach((t) => t(guild));

 guild.channels.cache
  .filter(
   (c) =>
    c.type !== Discord.ChannelType.PublicThread &&
    c.type !== Discord.ChannelType.PrivateThread &&
    c.type !== Discord.ChannelType.AnnouncementThread,
  )
  .forEach((c) => stickyPerms(undefined, c as Discord.GuildChannel));
};
