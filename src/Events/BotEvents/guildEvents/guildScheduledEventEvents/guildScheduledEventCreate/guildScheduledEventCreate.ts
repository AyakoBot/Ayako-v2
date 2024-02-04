import type * as Discord from 'discord.js';

export default async (event: Discord.GuildScheduledEvent) => {
 if (!event.guild) return;

 event.client.util.importCache.Events.BotEvents.guildEvents.guildScheduledEventEvents.guildScheduledEventCreate.log.file.default(
  event,
 );
};
