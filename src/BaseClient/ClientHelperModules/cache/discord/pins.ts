import * as Discord from 'discord.js';
import error from '../../error.js';
// eslint-disable-next-line import/no-cycle
import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';

export interface Pins {
 get: (
  msgId: string,
  channel: Discord.GuildTextBasedChannel,
 ) => Promise<Discord.Message | undefined>;
 set: (msg: Discord.Message) => void;
 find: (msgId: string) => Discord.Message | undefined;
 delete: (msgId: string) => void;
 cache: Map<string, Map<string, Map<string, Discord.Message>>>;
}

const self: Pins = {
 get: async (id, channel) => {
  const cached = self.cache.get(channel.guildId)?.get(channel.id)?.get(id);
  if (cached) return cached;

  if (!('lastPinTimestamp' in channel)) return undefined;

  // eslint-disable-next-line import/no-cycle
  const requestHandler = (await import('../../requestHandler.js')).request;
  const me = await getBotMemberFromGuild(channel.guild);
  const channelBitfield = me?.permissionsIn(channel);
  if (channelBitfield && !channelBitfield?.has(Discord.PermissionFlagsBits.ViewChannel)) {
   return undefined;
  }

  const fetched = await requestHandler.channels.getPins(channel);
  if ('message' in fetched) {
   error(channel.guild, new Error(`Couldnt get Channel Pins of ${channel.id}`));
   return undefined;
  }

  fetched?.forEach((f) => self.set(f));

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
