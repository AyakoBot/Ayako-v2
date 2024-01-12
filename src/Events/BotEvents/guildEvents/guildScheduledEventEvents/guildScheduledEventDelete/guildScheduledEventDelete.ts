import type * as Discord from 'discord.js';
import log from './log.js';

export default async (event: Discord.GuildScheduledEvent) => {
 const cached = event.client.util.cache.scheduledEventUsers.cache.get(event.guildId)?.get(event.id);
 event.client.util.cache.scheduledEventUsers.cache.get(event.guildId)?.delete(event.id);

 if (!event.guild) return;

 log(event, cached);
};
