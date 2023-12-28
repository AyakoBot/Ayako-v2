import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (event: Discord.GuildScheduledEvent) => {
 const cached = ch.cache.scheduledEventUsers.cache.get(event.guildId)?.get(event.id);
 ch.cache.scheduledEventUsers.cache.get(event.guildId)?.delete(event.id);

 if (!event.guild) return;

 log(event, cached);
};
