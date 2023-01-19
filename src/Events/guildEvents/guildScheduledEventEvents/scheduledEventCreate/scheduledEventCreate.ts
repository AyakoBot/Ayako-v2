import type * as Discord from 'discord.js';

export default async (scheduledEvent: Discord.GuildScheduledEvent) => {
  const files: {
    default: (s: Discord.GuildScheduledEvent) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(scheduledEvent));
};
