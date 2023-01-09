import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient.js';

export default (reaction: CT.ReactionAdd) => {
  if (!reaction.guildId) return;

  if (!client.reactions.get(reaction.guildId)) client.reactions.set(reaction.guildId, new Map());

  const guild = client.reactions.get(reaction.guildId);
  if (!guild?.get(reaction.channelId)) guild?.set(reaction.channelId, new Map());

  const channel = guild?.get(reaction.channelId);
  if (!channel?.get(reaction.messageId)) channel?.set(reaction.messageId, new Map());

  const message = channel?.get(reaction.messageId);
  if (!message?.get(reaction.emoji.id ?? reaction.emoji.name)) {
    message?.set(reaction.emoji.id ?? reaction.emoji.name, {
      count: 0,
      users: [],
      emoji: reaction.emoji,
    });
  }

  const reactions = message?.get(reaction.emoji.id ?? reaction.emoji.name);

  if (reactions) {
    reactions.count += 1;
    reactions.users.push(reaction.userId);
  }
};
