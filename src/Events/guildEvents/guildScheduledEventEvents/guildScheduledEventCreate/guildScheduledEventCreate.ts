import type * as Discord from 'discord.js';
import log from './log.js';

export default async (event: Discord.GuildScheduledEvent) => {
 if (!event.guild) return;

 log(event);
};
