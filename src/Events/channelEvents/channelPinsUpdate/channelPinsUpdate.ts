import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (channel: Discord.TextBasedChannel, date: Date) => {
  if (channel.isDMBased()) return;

  const newPins = await channel.messages.fetchPinned();
  const addedPins = newPins.filter((p) => !client.cache.pins.find(p.id));
  const removedPins = Array.from(
    client.cache.pins.cache.get(channel.guildId)?.get(channel.id) ?? new Map(),
    ([, p]) => p,
  ).filter((p) => !newPins.has(p.id));

  addedPins.forEach(async (p) => client.emit('channelPinsCreate', p, channel, date));
  removedPins.forEach(async (p) => client.emit('channelPinsDelete', p, channel, date));
};
