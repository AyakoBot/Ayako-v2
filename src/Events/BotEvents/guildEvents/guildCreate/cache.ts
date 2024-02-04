import * as Discord from 'discord.js';

export default (guild: Discord.Guild) => {
 Object.values(
  guild.client.util.importCache.Events.BotEvents.readyEvents.startupTasks.cache.file.tasks,
 ).forEach((t) => t(guild));

 guild.channels.cache
  .filter(
   (c) =>
    c.type !== Discord.ChannelType.PublicThread &&
    c.type !== Discord.ChannelType.PrivateThread &&
    c.type !== Discord.ChannelType.AnnouncementThread,
  )
  .forEach((c) =>
   guild.client.util.importCache.Events.BotEvents.channelEvents.channelUpdate.stickyPerms.file.default(
    undefined,
    c as Discord.GuildChannel,
   ),
  );
};
