import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (scheduledEvent: Discord.GuildScheduledEvent) => {
  const cached = ch.cache.scheduledEventUsers.cache
    .get(scheduledEvent.guildId)
    ?.get(scheduledEvent.id);
  ch.cache.scheduledEventUsers.cache.get(scheduledEvent.guildId)?.delete(scheduledEvent.id);

  log(scheduledEvent, cached);
};
