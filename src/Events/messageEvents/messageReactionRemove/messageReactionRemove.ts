import type * as Discord from 'discord.js';

export default async (reaction: Discord.MessageReaction, user: Discord.User) => {
  if (!reaction.message.guild) return;

  const msg = await reaction.message.fetch();

  const files: {
    default: (r: Discord.MessageReaction, u: Discord.User, m: Discord.Message) => void;
  }[] = await Promise.all(['./willis.js', './reactionRoles.js', './log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(reaction, user, msg));
};
