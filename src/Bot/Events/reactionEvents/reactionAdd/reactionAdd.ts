import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient.js';

export default async (reaction: CT.ReactionAdd) => {
  if (!reaction.guildId) return;

  const files: { default: (t: CT.ReactionAdd) => void }[] = await Promise.all(
    ['./willis.js', './reactionRoles.js', './log.js'].map((p) => import(p)),
  );

  const message = await client.ch.cache.messages.get(
    reaction.messageId,
    reaction.channelId,
    reaction.guildId,
  );
  if (!message) return;

  const ident = reaction.emoji.id ?? reaction.emoji.name;
  if (!ident) return;

  const reactions = await client.ch.getReactions(message, reaction.channelId, ident);
  reactions.forEach((r) => client.ch.cache.users.set(r));

  client.ch.cache.reactions.set(
    { users: reactions.map((u) => u.id), emoji: reaction.emoji },
    reaction.messageId,
    reaction.channelId,
    reaction.guildId,
  );

  files.forEach((f) => f.default(reaction));
};
