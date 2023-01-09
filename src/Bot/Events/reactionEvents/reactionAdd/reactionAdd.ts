import type CT from '../../../Typings/CustomTypings';

export default async (reaction: CT.ReactionAdd) => {
  if (!reaction.guildId) return;

  const files: { default: (t: CT.ReactionAdd) => void }[] = await Promise.all(
    ['./willis.js', './reactionRoles.js', './log.js', './cache.js'].map((p) => import(p)),
  );

  files.forEach((f) => f.default(reaction));
};
