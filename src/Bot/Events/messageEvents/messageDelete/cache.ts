import client from '../../../BaseClient/DDenoClient.js';
import type CT from '../../../Typings/CustomTypings';

export default async (msg: CT.MessageGuild) => {
  const guild = client.reactions.get(msg.guildId);
  if (!guild) return;

  const channel = guild.get(msg.channelId);
  if (!channel) return;

  const message = channel.get(msg.id);
  if (!message) return;

  if (channel.size === 1) {
    if (guild.size === 1) {
      if (client.reactions.size === 1) client.reactions.clear();
      else client.reactions.delete(msg.guildId);
    } else guild.delete(msg.channelId);
  } else channel.delete(msg.id);
};
