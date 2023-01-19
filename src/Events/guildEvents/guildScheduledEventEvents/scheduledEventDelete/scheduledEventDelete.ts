import type * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';

export default async (scheduledEvent: Discord.GuildScheduledEvent) => {
  const cached = client.ch.cache.scheduledEventUsers.cache
    .get(scheduledEvent.guildId)
    ?.get(scheduledEvent.id);
  client.ch.cache.scheduledEventUsers.cache.get(scheduledEvent.guildId)?.delete(scheduledEvent.id);

  const files: {
    default: (s: Discord.GuildScheduledEvent, c: Map<string, Discord.User> | undefined) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(scheduledEvent, cached));
};
