import * as Discord from 'discord.js';
import { request } from './requestHandler.js';

/**
 * Fetches a specified amount of messages from a guild text-based channel,
 * optionally before a specified message ID.
 * @param channel The guild text-based channel to fetch messages from.
 * @param filter An object containing the amount of messages to fetch
 * and an optional message ID to fetch messages before.
 * @returns An array of messages fetched from the channel,
 * filtered by the before parameter if it exists.
 */
export default async (
 channel: Discord.GuildTextBasedChannel,
 filter: {
  amount: number;
  before?: string;
 },
) => {
 const messages: Discord.Message<true>[] = [];
 let lastAmount = 0;

 for (let i = 0; i < filter.amount / 100; i += 1) {
  // eslint-disable-next-line no-await-in-loop
  const msgs = await request.channels.getMessages(channel, {
   limit: Math.min(100, filter.amount - messages.length),
   before: messages.at(-1)?.id ?? filter.before,
  });

  if ('message' in msgs) return [];

  if (msgs.length === 0) break;

  msgs.filter((m) => !messages.find((m2) => m2.id === m.id)).forEach((m) => messages.push(m));

  if (messages.length >= filter.amount) break;
  if (msgs.length === lastAmount && msgs.length < 100) break;

  lastAmount = msgs.length;
 }

 return messages.slice(0, filter.amount);
};
