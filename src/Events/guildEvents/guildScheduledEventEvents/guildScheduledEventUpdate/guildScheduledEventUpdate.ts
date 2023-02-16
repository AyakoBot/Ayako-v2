import type * as Discord from 'discord.js';
import log from './log.js';

export default async (
  oldEvent: Discord.GuildScheduledEvent,
  event: Discord.GuildScheduledEvent,
) => {
  log(oldEvent, event);
};
