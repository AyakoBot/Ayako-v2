import type * as Discord from 'discord.js';
import log from './log.js';

export default async (reaction: Discord.MessageReaction, user: Discord.User) => {
  if (!reaction.message.guild) return;

  log(reaction, user, await reaction.message.fetch());
};
