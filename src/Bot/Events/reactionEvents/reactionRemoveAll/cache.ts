import client from '../../../BaseClient/DDenoClient.js';

export default (reaction: { channelId: bigint; messageId: bigint; guildId?: bigint }) => {
  if (!reaction.guildId) return;

  const guild = client.reactions.get(reaction.guildId);
  if (!guild?.get(reaction.channelId)) return;

  const channel = guild.get(reaction.channelId);
  if (!channel?.get(reaction.messageId)) return;

  const message = channel.get(reaction.messageId);
  if (!message?.get(reaction.messageId)) return;

  if (channel.size === 1) {
    if (guild.size === 1) {
      if (client.reactions.size === 1) client.reactions.clear();
      else client.reactions.delete(reaction.guildId);
    } else guild.delete(reaction.channelId);
  } else channel.delete(reaction.messageId);
};
