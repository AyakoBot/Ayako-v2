import type * as Discord from 'discord.js';

export default async (event: Discord.GuildScheduledEvent, user: Discord.User) => {
 event.client.util.cache.scheduledEventUsers.add(user, event.guildId, event.id);

 if (!event.guild) return;

 event.client.util.importCache.Events.BotEvents.guildEvents.guildScheduledEventEvents.guildScheduledEventUserAdd.log.file.default(
  event,
  user,
 );
};
