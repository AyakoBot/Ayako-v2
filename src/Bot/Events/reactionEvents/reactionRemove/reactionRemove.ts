import type CT from '../../../Typings/CustomTypings';

export default async (reaction: CT.ReactionRemove) => {
  if (!reaction.guildId) return;

  const files: { default: (t: CT.ReactionRemove) => void }[] = await Promise.all(
    ['./reactionRoles.js', './log.js'].map((p) => import(p)),
  );

  files.forEach((f) => f.default(reaction));
};
