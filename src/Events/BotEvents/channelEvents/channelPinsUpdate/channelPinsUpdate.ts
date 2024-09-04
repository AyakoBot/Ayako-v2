import type * as Discord from 'discord.js';
import channelPinsCreate from './channelPinsCreate/channelPinsCreate.js';
import channelPinsDelete from './channelPinsDelete/channelPinsDelete.js';

export default async (
 channel:
  | Discord.NewsChannel
  | Discord.TextChannel
  | Discord.PrivateThreadChannel
  | Discord.PublicThreadChannel
  | Discord.VoiceChannel,
 date: Date,
) => {
 if (channel.isDMBased()) return;

 const newPins = await channel.client.util.request.channels.getPins(channel).then((pins) => {
  if ('message' in pins) {
   channel.client.util.error(channel.guild, new Error(pins.message));
   return undefined;
  }
  return pins;
 });
 if (!newPins) return;

 const addedPins = newPins.filter((p) => !channel.client.util.cache.pins.find(p.id));
 const removedPins = Array.from(
  channel.client.util.cache.pins.cache.get(channel.guildId)?.get(channel.id) ?? new Map(),
  ([, p]) => p as Discord.Message<boolean>,
 ).filter((p) => !newPins.find((p1) => p.id === p1.id));

 addedPins.forEach(async (p) => channelPinsCreate(p, channel, date));
 removedPins.forEach(async (p) => channelPinsDelete(p, channel));
};
