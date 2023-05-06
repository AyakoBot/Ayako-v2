import type * as Discord from 'discord.js';
import log from './log.js';

export default async (scheduledEvent: Discord.GuildScheduledEvent) => {
 log(scheduledEvent);
};
