import type * as Discord from 'discord.js';
import log from './log.js';

export default async (reaction: Discord.MessageReaction, user: Discord.User) => {
  if (!reaction.message.guild) return;

  const msg = await reaction.message.fetch().catch(() => undefined);
  if (!msg) return;

  const r = msg.reactions.cache.get(reaction.emoji.identifier);

  if (!r?.count && r) r.count = 1;

  log(reaction, user, msg);
};
