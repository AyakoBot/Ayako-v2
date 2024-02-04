import type * as Discord from 'discord.js';

export default async (
 oldEvent: Discord.GuildScheduledEvent,
 event: Discord.GuildScheduledEvent,
) => {
 if (!event.guild) return;

 event.client.util.importCache.Events.BotEvents.guildEvents.guildScheduledEventEvents.guildScheduledEventUpdate.log.file.default(
  oldEvent,
  event,
 );
};
