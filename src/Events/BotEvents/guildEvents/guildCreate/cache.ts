import * as Discord from 'discord.js';
import stickyPerms from '../../channelEvents/channelUpdate/stickyPerms.js';
import { startupTasks } from '../../readyEvents/startupTasks/cache.js';

export default (guild: Discord.Guild) => {
 Object.values(startupTasks).forEach((t) => t([guild.id]));

 guild.channels.cache
  .filter(
   (c) =>
    c.type !== Discord.ChannelType.PublicThread &&
    c.type !== Discord.ChannelType.PrivateThread &&
    c.type !== Discord.ChannelType.AnnouncementThread,
  )
  .forEach((c) => stickyPerms(undefined, c as Discord.GuildChannel));

 guild.client.util.DataBase.guilds
  .create({
   data: {
    fetchat: Date.now(),
    guildid: guild.id,
    name: guild.name,
    banner: guild.bannerURL(),
    icon: guild.iconURL(),
    invite: guild.vanityURLCode,
    membercount: guild.memberCount,
   },
  })
  .then();
};
