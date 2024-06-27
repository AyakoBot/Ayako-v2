import * as Discord from 'discord.js';
import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';

/**
 * Interface for managing pinned messages in a Discord guild text-based channel.
 */
export interface Pins {
 /**
  * Retrieves a pinned message by its ID in the specified channel.
  * @param msgId The ID of the pinned message to retrieve.
  * @param channel The guild text-based channel where the pinned message is located.
  * @returns A Promise that resolves with the pinned message, or undefined if not found.
  */
 get: (
  msgId: string,
  channel: Discord.GuildTextBasedChannel,
 ) => Promise<Discord.Message | undefined>;

 /**
  * Adds a message to the cache of pinned messages.
  * @param msg The message to add to the cache.
  */
 set: (msg: Discord.Message) => void;

 /**
  * Finds a pinned message by its ID.
  * @param msgId The ID of the pinned message to find.
  * @returns The pinned message, or undefined if not found.
  */
 find: (msgId: string) => Discord.Message | undefined;

 /**
  * Deletes a pinned message from the cache.
  * @param msgId The ID of the pinned message to delete.
  */
 delete: (msgId: string) => void;

 /**
  * The cache of pinned messages, organized by guild ID, channel ID, and message ID.
  */
 cache: Map<string, Map<string, Map<string, Discord.Message>>>;
}

const self: Pins = {
 get: async (id, channel) => {
  const cached = self.cache.get(channel.guildId)?.get(channel.id)?.get(id);
  if (cached) return cached;

  if (!('lastPinTimestamp' in channel)) return undefined;

  const me = await getBotMemberFromGuild(channel.guild);
  const channelBitfield = me?.permissionsIn(channel);
  if (channelBitfield && !channelBitfield.has(Discord.PermissionFlagsBits.ViewChannel)) {
   return undefined;
  }

  const fetched = await channel.client.util.request.channels.getPins(channel);
  if ('message' in fetched) return undefined;

  fetched.forEach((f) => self.set(f));

  return fetched.find((f) => f.id === id);
 },
 set: (msg) => {
  if (!msg.guildId) return;

  if (!self.cache.get(msg.guildId)) self.cache.set(msg.guildId, new Map());

  if (!self.cache.get(msg.guildId)?.get(msg.channelId)) {
   self.cache.get(msg.guildId)?.set(msg.channelId, new Map());
  }

  self.cache.get(msg.guildId)?.get(msg.channelId)?.set(msg.id, msg);
 },
 find: (id) =>
  Array.from(self.cache, ([, g]) => g)
   .map((c) => Array.from(c, ([, i]) => i))
   .flat()
   .find((c) => c.get(id))
   ?.get(id),
 delete: (id) => {
  const cached = self.find(id);
  if (!cached || !cached.guildId || !cached.channelId) return;

  if (self.cache.get(cached.guildId)?.size === 1) {
   if (self.cache.get(cached.guildId)?.get(cached.channelId)?.size === 1) {
    self.cache.get(cached.guildId)?.get(cached.channelId)?.clear();
   } else self.cache.get(cached.guildId)?.get(cached.channelId)?.delete(id);
  } else if (self.cache.get(cached.guildId)?.get(cached.channelId)?.size === 1) {
   self.cache.get(cached.guildId)?.delete(cached.channelId);
  } else self.cache.get(cached.guildId)?.get(cached.channelId)?.delete(id);
 },
 cache: new Map(),
};

export default self;
