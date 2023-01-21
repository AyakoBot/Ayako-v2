import type * as Discord from 'discord.js';

export default async (reaction: Discord.MessageReaction) => {
  const msg = await reaction.message.fetch();

  const files: {
    default: (r: Discord.MessageReaction, m: Discord.Message) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(reaction, msg));
};
