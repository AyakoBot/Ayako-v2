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
   limit: 100,
   before: messages.at(-1)?.id ?? filter.before,
  });

  if ('message' in msgs) return [];
  msgs.filter((m) => !messages.find((m2) => m2.id === m.id)).forEach((m) => messages.push(m));

  if (msgs.length === lastAmount) i = filter.amount / 100;
  lastAmount = msgs.length;
 }

 return messages;
};
