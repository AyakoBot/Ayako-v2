import type * as Discord from 'discord.js';

export default async (
  msgs: Discord.Collection<Discord.Snowflake, Discord.Message>,
  channel: Discord.GuildTextBasedChannel,
) => {
  const files: {
    default: (
      t: Discord.Collection<Discord.Snowflake, Discord.Message>,
      g: Discord.GuildTextBasedChannel,
    ) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(msgs, channel));
};
