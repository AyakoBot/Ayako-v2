import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (msg: DDeno.Message) => {
  if (!msg.guild.id) return;

  client.ch.cache.giveaways.delete(msg.guild.id, msg.channelId, msg.id);
  const reactions = client.ch.cache.reactions.cache
    .get(msg.guild.id)
    ?.get(msg.channelId)
    ?.get(msg.id);
  if (reactions) {
    const array = Array.from(reactions, ([, r]) => r);
    array.forEach((r) => {
      const ident = r.emoji.id ?? r.emoji.name;
      if (!ident || !msg.guild.id) return;
      client.ch.cache.reactions.delete(ident, msg.id, msg.channelId, msg.guild.id);
    });
  }
};
