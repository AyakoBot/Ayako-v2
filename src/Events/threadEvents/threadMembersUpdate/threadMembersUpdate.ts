import type * as Discord from 'discord.js';

export default async (
  added: Discord.Collection<Discord.Snowflake, Discord.ThreadMember>,
  removed: Discord.Collection<Discord.Snowflake, Discord.ThreadMember>,
  thread: Discord.ThreadChannel,
) => {
  const files: {
    default: (
      a: Discord.Collection<Discord.Snowflake, Discord.ThreadMember>,
      r: Discord.Collection<Discord.Snowflake, Discord.ThreadMember>,
      t: Discord.ThreadChannel,
    ) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(added, removed, thread));
};
