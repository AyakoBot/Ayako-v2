import type * as Discord from 'discord.js';

export default async (reaction: Discord.MessageReaction, user: Discord.User) => {
  if (!reaction.message.guild) return;

  const msg = await reaction.message.fetch().catch(() => undefined);
  if (!msg) return;

  const r = msg.reactions.cache.get(reaction.emoji.identifier);

  if (!r?.count && r) r.count = 1;

  const files: {
    default: (a: Discord.MessageReaction, u: Discord.User, m: Discord.Message) => void;
  }[] = await Promise.all(['./reactionRoles.js', './log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(reaction, user, msg));
};
