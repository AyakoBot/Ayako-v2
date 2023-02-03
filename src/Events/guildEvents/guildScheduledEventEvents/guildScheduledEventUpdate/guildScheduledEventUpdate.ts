import type * as Discord from 'discord.js';

export default async (
  oldEvent: Discord.GuildScheduledEvent,
  event: Discord.GuildScheduledEvent,
) => {
  const files: {
    default: (p: Discord.GuildScheduledEvent, d: Discord.GuildScheduledEvent) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(oldEvent, event));
};
