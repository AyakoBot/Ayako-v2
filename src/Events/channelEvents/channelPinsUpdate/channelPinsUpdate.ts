import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import channelPinsCreate from './channelPinsCreate/channelPinsCreate.js';
import channelPinsDelete from './channelPinsDelete/channelPinsDelete.js';
import { Message } from '../../../BaseClient/Other/classes.js';

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

 const newPins = await ch.request.channels.getPins(channel.guild, channel.id).then((pins) => {
  if ('message' in pins) {
   ch.error(channel.guild, new Error(pins.message));
   return undefined;
  }
  return pins.map((p) => new Message(channel.client, p));
 });
 if (!newPins) return;

 const addedPins = newPins.filter((p) => !ch.cache.pins.find(p.id));
 const removedPins = Array.from(
  ch.cache.pins.cache.get(channel.guildId)?.get(channel.id) ?? new Map(),
  ([, p]) => p,
 ).filter((p) => !newPins.find((p1) => p.id === p1.id));

 addedPins.forEach(async (p) => channelPinsCreate(p, channel, date));
 removedPins.forEach(async (p) => channelPinsDelete(p, channel));
};
