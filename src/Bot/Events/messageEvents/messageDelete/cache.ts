import type DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (msg: DDeno.Message) => {
  if (!msg.guildId) return;

  client.ch.cache.giveaways.delete(msg.guildId, msg.channelId, msg.id);
  const reactions = client.ch.cache.reactions.cache
    .get(msg.guildId)
    ?.get(msg.channelId)
    ?.get(msg.id);
  if (reactions) {
    const array = Array.from(reactions, ([, r]) => r);
    array.forEach((r) => {
      const ident = r.emoji.id ?? r.emoji.name;
      if (!ident || !msg.guildId) return;
      client.ch.cache.reactions.delete(ident, msg.id, msg.channelId, msg.guildId);
    });
  }
};
