import type * as Discord from 'discord.js';
import log from './log.js';

export default async (reaction: Discord.MessageReaction) => {
  log(reaction, await reaction.message.fetch());
};
