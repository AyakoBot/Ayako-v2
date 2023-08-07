import * as Jobs from 'node-schedule';

export interface ChannelBans {
 set: (job: Jobs.Job, guildId: string, channelId: string, userId: string) => void;
 delete: (guildId: string, channelId: string, userId: string) => void;
 cache: Map<string, Map<string, Map<string, Jobs.Job>>>;
}

const self: ChannelBans = {
 set: (job, guildId, channelId, userId) => {
  const cached = self.cache.get(guildId)?.get(channelId)?.get(userId);
  cached?.cancel();

  if (!self.cache.get(guildId)) {
   self.cache.set(guildId, new Map());
  }

  if (!self.cache.get(guildId)?.get(channelId)) {
   self.cache.get(guildId)?.set(channelId, new Map());
  }

  self.cache.get(guildId)?.get(channelId)?.set(userId, job);
 },
 delete: (guildId, channelId, userId) => {
  const cached = self.cache.get(guildId)?.get(channelId)?.get(userId);
  cached?.cancel();

  if (self.cache.get(guildId)?.size === 1) {
   if (self.cache.get(guildId)?.get(channelId)?.size === 1) {
    self.cache.get(guildId)?.get(channelId)?.clear();
   } else self.cache.get(guildId)?.get(channelId)?.delete(userId);
  } else if (self.cache.get(guildId)?.get(channelId)?.size === 1) {
   self.cache.get(guildId)?.delete(channelId);
  } else self.cache.get(guildId)?.get(channelId)?.delete(userId);
 },
 cache: new Map(),
};

export default self;
