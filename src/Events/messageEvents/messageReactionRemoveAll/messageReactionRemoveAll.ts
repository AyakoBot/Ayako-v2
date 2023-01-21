import type * as Discord from 'discord.js';

export default async (
  msg: Discord.Message,
  reactions: Discord.Collection<string | Discord.Snowflake, Discord.MessageReaction>,
) => {
  const files: {
    default: (
      m: Discord.Message,
      r: Discord.Collection<string | Discord.Snowflake, Discord.MessageReaction>,
    ) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(msg, reactions));
};
