import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (event: Discord.GuildScheduledEvent, user: Discord.User) => {
 ch.cache.scheduledEventUsers.add(user, event.guildId, event.id);

 log(event, user);
};
