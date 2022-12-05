import type CT from '../../../Typings/CustomTypings';

export default async (reaction: CT.Reaction) => {
  if (!reaction.guildId) return;

  const files: { default: (t: CT.Reaction) => void }[] = await Promise.all(
    ['./willis.js', './reactionRoles.js', './log.js'].map((p) => import(p)),
  );

  files.forEach((f) => f.default(reaction));
};
