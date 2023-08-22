import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';

export interface Pins {
 get: (
  msgId: string,
  channelId: string,
  guild: Discord.Guild,
 ) => Promise<Discord.Message | undefined>;
 set: (msg: Discord.Message) => void;
 find: (msgId: string) => Discord.Message | undefined;
 delete: (msgId: string) => void;
 cache: Map<string, Map<string, Map<string, Discord.Message>>>;
}

const self: Pins = {
 get: async (id, channelId, guild) => {
  const cached = self.cache.get(guild.id)?.get(channelId)?.get(id);
  if (cached) return cached;

  // eslint-disable-next-line import/no-cycle
  const requestHandler = (await import('../../requestHandler.js')).request;
  const fetched = await requestHandler.channels.getPins(guild, channelId);
  fetched?.forEach((f) => self.set(new Classes.Message(guild.client, f)));

  return self.cache.get(guild.id)?.get(channelId)?.get(id);
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
