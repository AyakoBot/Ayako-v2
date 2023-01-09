import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient.js';

export default (reaction: CT.ReactionAdd) => {
  if (!reaction.guildId) return;

  const guild = client.reactions.get(reaction.guildId);
  if (!guild?.get(reaction.channelId)) return;

  const channel = guild.get(reaction.channelId);
  if (!channel?.get(reaction.messageId)) return;

  const message = channel.get(reaction.messageId);
  if (!message?.get(reaction.messageId)) return;

  const reactions = message.get(reaction.emoji.id ?? reaction.emoji.name);
  if (!reactions) return;

  if (reactions.users.length === 1) {
    if (message.size === 1) {
      if (channel.size === 1) {
        if (guild.size === 1) {
          if (client.reactions.size === 1) client.reactions.clear();
          else client.reactions.delete(reaction.guildId);
        } else guild.delete(reaction.channelId);
      } else channel.delete(reaction.messageId);
    } else message.delete(reaction.emoji.id ?? reaction.emoji.name);
  } else {
    reactions.users.splice(reactions.users.indexOf(reaction.userId), 1);
    reactions.count -= 1;
  }
};
